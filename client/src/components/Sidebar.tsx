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

    return (
        <div
            style={{ width: isMenuOpen ? 0 : width }}
            className={`h-full min-h-0 shrink-0 bg-[#0F1117] border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}
        >
            {/* Messages container */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-5">
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
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-gray-800/50 bg-[#1A1D26]`}>
                                        {isUser ? <UserIcon size={14} className="text-gray-400" /> : <BotIcon size={14} className="text-white" />}
                                    </div>
                                    <div
                                        className={`max-w-[85%] p-3 px-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isUser
                                            ? 'bg-[#6366F1] text-white rounded-tr-none'
                                            : 'bg-[#1A1D26] text-gray-100 rounded-tl-none border border-gray-800/50'
                                            }`}
                                    >
                                        {msg.content}
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
                                            <span className="text-xs font-medium text-indigo-400">Code Update</span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(ver.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <Link
                                            target="_blank"
                                            to={`/preview/${project.id}/${ver.id}`}
                                            className="p-1.5 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg group"
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
                                            className="text-[11px] bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white py-1.5 px-3 rounded transition-all border border-indigo-600/30"
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
                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#1A1D26] border border-gray-800/50 flex items-center justify-center">
                            <BotIcon size={14} className="text-white" />
                        </div>
                        <div className="bg-[#1A1D26] p-3 rounded-2xl rounded-tl-none border border-gray-800/50 flex gap-1.5 items-center">
                            <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0s' }} />
                            <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0.15s' }} />
                            <span className="size-1.5 rounded-full animate-bounce bg-gray-500" style={{ animationDelay: '0.3s' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="p-4 shrink-0">
                <form className="relative flex items-center bg-[#1A1D26] border border-gray-800/50 rounded-2xl p-2 px-4 shadow-2xl transition-all focus-within:border-indigo-500/50" onSubmit={(e) => e.preventDefault()}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent text-gray-300 py-2 text-sm focus:outline-none placeholder:text-gray-500 resize-none min-h-[36px] max-h-[200px] no-scrollbar"
                        disabled={isGenerating}
                        rows={1}
                        placeholder="Describe your website or request changes..."
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !input.trim()}
                        className="ml-2 shrink-0 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-full transition-all shadow-lg self-end mb-1"
                    >
                        {isGenerating ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon size={16} />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Sidebar
