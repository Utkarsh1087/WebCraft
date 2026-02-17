import React from 'react'
import { EyeIcon, UserIcon, BotIcon, Loader2Icon, SendIcon } from 'lucide-react'
import type { Project } from '../types/index.ts'
import type { Message } from '../types/index.ts'
import type { Version } from '../types/index.ts'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'

interface SidebarProps {
    project: Project
    isMenuOpen: boolean
    setProject: (project: Project | null) => void
    isGenerating: boolean
    setIsGenerating: (isGenerating: boolean) => void
    width: number
}

const Sidebar = ({ project, isMenuOpen, setProject, isGenerating, setIsGenerating, width }: SidebarProps) => {

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState('')

    const handleRollback = async (versionId: string) => {
        const version = project.versions.find(v => v.id === versionId)
        if (version) {
            setProject({
                ...project,
                current_code: version.code,
                current_version_index: version.id
            })
        }
    }

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
    }, [project.conversation.length, isGenerating])

    const keywords = ['colors', 'fonts', 'layout', 'fixed position', 'responsive', 'animation', 'header', 'footer', 'navigation', 'sidebar', 'button', 'gradient', 'dark mode', 'mobile', 'desktop', 'website', 'page', 'section', 'style', 'design']

    const highlightKeywords = (text: string) => {
        const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, i) =>
            keywords.some(k => k.toLowerCase() === part.toLowerCase())
                ? <span key={i} className="text-indigo-300 font-medium">{part}</span>
                : part
        )
    }

    const handleRevisions=async(e:React.FormEvent)=>{
        e.preventDefault()
       
        setIsGenerating(true)
        setTimeout(()=>{
            setIsGenerating(false)
        },3000)
        
    }

    return (
        <div
            style={{ width: isMenuOpen ? 0 : width }}
            className={`h-full min-h-0 shrink-0 bg-[#0F1117] transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
        >
            {/* Messages container */}
            <div className="relative flex-1 min-h-0 flex flex-col">
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-5">
                    {[...project.conversation, ...project.versions]
                        .sort(
                            (a, b) =>
                                new Date(a.timestamp).getTime() -
                                new Date(b.timestamp).getTime()
                        )
                        .map((item, index) => {
                            const isMessage = 'content' in item

                            if (isMessage) {
                                const msg = item as Message
                                const isUser = msg.role === 'user'
                                return (
                                    <div
                                        key={msg.id || index}
                                        className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-[#1A1D26] backdrop-blur-sm`}>
                                            {isUser ? <UserIcon size={14} className="text-gray-400" /> : <BotIcon size={14} className="text-white" />}
                                        </div>
                                        <div
                                            className={`max-w-[85%] p-3.5 px-4 rounded-2xl text-sm leading-8 transition-all duration-300 ease-in-out cursor-default ${isUser
                                                ? 'bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-sm text-white rounded-tr-none border border-indigo-400/20 shadow-md hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 hover:from-indigo-400/90 hover:to-purple-500/90 active:scale-[0.98]'
                                                : 'bg-white/[0.04] backdrop-blur-sm text-gray-100 rounded-tl-none border border-white/10 shadow-sm hover:bg-white/[0.06]'
                                                }`}
                                        >
                                            {isUser ? highlightKeywords(msg.content) : msg.content}
                                        </div>
                                    </div>
                                )
                            } else {
                                const ver = item as Version
                                return (
                                    <div
                                        key={ver.id || index}
                                        className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 shadow-sm flex flex-col gap-3 my-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-indigo-400 tracking-wider">Code Update</span>
                                                <span className="text-[10px] text-gray-600">
                                                    {new Date(ver.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <Link
                                                target="_blank"
                                                to={`/preview/${project.id}/${ver.id}`}
                                                className="p-1.5 bg-gray-700 hover:bg-gray-600 hover:brightness-110 transition-all duration-300 ease-in-out rounded-lg group cursor-pointer active:scale-95"
                                                title="View this version"
                                            >
                                                <EyeIcon size={14} className="group-hover:text-indigo-400" />
                                            </Link>
                                        </div>

                                        {project.current_version_index === ver.id ? (
                                            <div className="text-[11px] text-gray-400 bg-gray-700/50 py-1.5 px-3 rounded text-center border border-gray-600/50">
                                                Current Version
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRollback(ver.id)}
                                                className="text-[11px] bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:brightness-110 py-1.5 px-3 rounded transition-all duration-300 ease-in-out border border-indigo-600/30 cursor-pointer active:scale-95"
                                            >
                                                Rollback to this version
                                            </button>
                                        )}
                                    </div>
                                )
                            }
                        })}

                    {isGenerating && (
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                <BotIcon size={14} className="text-white" />
                            </div>
                            <div className="bg-white/[0.04] backdrop-blur-sm p-3.5 rounded-2xl rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                                <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0s' }} />
                                <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0.15s' }} />
                                <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    )}
                </div>
                {/* Scroll fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0F1117] to-transparent pointer-events-none" />
            </div>

            {/* Input area */}
            <div className="p-4 shrink-0">
                <form onSubmit={handleRevisions} className="relative flex items-center bg-[#1A1D26] border border-gray-800/50 rounded-2xl p-2 px-4 shadow-2xl transition-all duration-300 ease-in-out focus-within:border-indigo-500/50" >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent text-gray-300 py-2 text-sm focus:outline-none placeholder:text-gray-500 resize-none min-h-[22px] max-h-[180px] no-scrollbar"
                        disabled={isGenerating}
                        rows={1}
                        placeholder="Describe your website or request changes..."
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !input.trim()}
                        className="ml-2 shrink-0 p-2.5 bg-indigo-600 hover:bg-indigo-500 hover:brightness-110 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 ease-in-out shadow-lg self-end mb-1 cursor-pointer active:scale-95"
                    >
                        {isGenerating ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon size={16} />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Sidebar
