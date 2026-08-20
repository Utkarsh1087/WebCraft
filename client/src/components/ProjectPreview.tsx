import { forwardRef, useImperativeHandle } from 'react'
import type { Project } from '../types/index.ts'
import { useRef } from 'react'
import iframeScript from '../utils/iframeScript.ts'
import { useState } from 'react'
import { useEffect } from 'react'
import EditorPanel from './EditorPanel.tsx'

interface ProjectPreviewProps {
    project: Project;
    isGenerating: boolean;
    device?: 'phone' | 'tablet' | 'desktop';
    showEditorPanel?: boolean;
}


export interface ProjectPreviewRef {
    getCode: () => string | undefined;
}


const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({ project, isGenerating, device = 'desktop', showEditorPanel = true }, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [selectedElement, setSelectedElement] = useState<any>(null)

    const resolutions = {
        phone: 'w-[412px]',
        tablet: 'w-[768px]',
        desktop: 'w-full'
    }


    useImperativeHandle(ref, () => ({
        getCode: () => {
            const doc = iframeRef.current?.contentDocument
            if (!doc) return undefined
            //1. Remove our selection class / attributes / outline from all elements

            doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((el) => {
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                (el as HTMLElement).style.outline = '';
            })

            //2. Remove injected style + script from the document
            const previewStyle = doc.getElementById('ai-preview-style');
            if (previewStyle) previewStyle.remove();

            const previewScript = doc.getElementById('ai-preview-script');
            if (previewScript) previewScript.remove();

            // 3. Serialize clean HTML

            const html = doc.documentElement.outerHTML;
            return html;

        }
    }))

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(event.data.payload);
            } else if (event.data.type === 'CLEAR_SELECTION') {
                setSelectedElement(null);
            }
        }
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    const handleUpdate = (updates: any) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ELEMENT',
                payload: updates
            }, '*')
        }
    }

    const injectPreview = (html: string) => {
        if (!html) return '';

        // Safely inject script before closing body, or at the end if body is missing
        // In some cases, appending to the end can cause the script to be rendered as text 
        // if there's an unclosed tag like <pre> or <textarea>.
        // We ensure it's wrapped in a clean environment.
        const scriptTag = `\n${iframeScript}\n`;

        if (html.includes('<body')) {
            // Inject as the first child of body to avoid being trapped in unclosed tags at the bottom
            return html.replace(/(<body[^>]*>)/i, `$1${scriptTag}`);
        } else {
            return scriptTag + html;
        }
    }

    return (
        <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
            {
                project.current_code ? (
                    <>
                        <iframe ref={iframeRef}
                            srcDoc={injectPreview(project.current_code)}
                            className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}

                        />
                        {showEditorPanel && selectedElement && (
                            <EditorPanel selectedElement={selectedElement}
                                onUpdate={handleUpdate} onClose={() => {
                                    setSelectedElement(null)
                                    if (iframeRef.current?.contentWindow) {
                                        iframeRef.current.contentWindow.postMessage({
                                            type: 'CLEAR_SELECTION_REQUEST'
                                        }, '*')
                                    }
                                }} />
                        )}




                    </>
                ) : isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                        <div className="relative flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                            <div className="absolute w-8 h-8 rounded-full bg-[#A6FF5D]/20 animate-ping" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200">Generating Your Website...</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm">
                                AI is building clean, responsive HTML with Tailwind CSS. This will appear here automatically.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                        <div className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-medium text-gray-200">No Preview Available</h4>
                        <p className="text-xs text-gray-400 max-w-sm">
                            Website generation could not be completed. Check the chat on the left or update your AI API Key.
                        </p>
                    </div>
                )
            }


        </div>
    )
})

export default ProjectPreview