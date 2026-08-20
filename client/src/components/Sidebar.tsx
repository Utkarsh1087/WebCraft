import React from 'react'
import { EyeIcon, UserIcon, BotIcon, Loader2Icon, SendIcon, X } from 'lucide-react'
import type { Project } from '../types/index.ts'
import type { Message } from '../types/index.ts'
import type { Version } from '../types/index.ts'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import api from '@/configs/axios'
import { toast } from 'sonner'

interface SidebarProps {
    project: Project
    isMenuOpen: boolean
    setIsMenuOpen: (isOpen: boolean) => void
    setProject: (project: Project | null) => void
    isGenerating: boolean
    setIsGenerating: (isGenerating: boolean) => void
    width: number
}

const Sidebar = ({ project, isMenuOpen, setIsMenuOpen, setProject, isGenerating, setIsGenerating, width }: SidebarProps) => {

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

    const handleRevisions = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        const messageText = input;
        setInput('');
        setIsGenerating(true);

        try {
            const { data } = await api.post(`/api/project/revision/${project.id}`, { message: messageText });
            toast.success(data.message || "Revision requested");
            // Refresh project to get new version and conversation messages
            const projectRes = await api.get(`/api/user/project/${project.id}`);
            if (projectRes.data.project) {
                setProject(projectRes.data.project);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
            // Refresh project to show assistant error message and updated credits
            const projectRes = await api.get(`/api/user/project/${project.id}`);
            if (projectRes.data.project) {
                setProject(projectRes.data.project);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div
            style={{ 
                '--sidebar-width': `${width}px`,
                width: isMenuOpen ? 0 : undefined 
            } as React.CSSProperties}
            className={`h-full min-h-0 shrink-0 bg-[#0F131F] transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${!isMenuOpen ? 'w-full lg:w-(--sidebar-width)' : 'w-0'}`}
        >
            {/* Messages container with clean top gap & subtle fades */}
            <div className="relative flex-1 min-h-0 flex flex-col">
                {/* Subtle top fade */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0F131F] to-transparent pointer-events-none z-10" />

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-4 pt-6 pb-4 flex flex-col gap-4">
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
                                        className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`shrink-0 size-7 rounded-full flex items-center justify-center border border-white/10 bg-[#1A1F2C]`}>
                                            {isUser ? <UserIcon size={13} className="text-gray-300" /> : <BotIcon size={13} className="text-indigo-400" />}
                                        </div>
                                        <div
                                            className={`max-w-[85%] p-3 px-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap transition-all duration-200 cursor-default shadow-sm ${isUser
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md border border-indigo-400/20 shadow-indigo-500/10'
                                                : 'bg-[#181D2A] text-gray-200 rounded-tl-md border border-gray-800/80'
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
                                        className="w-full p-3.5 rounded-xl bg-[#141926] border border-gray-800 text-gray-100 shadow-sm flex flex-col gap-2.5 my-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-indigo-400">Code Version</span>
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(ver.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <Link
                                                target="_blank"
                                                to={`/preview/${project.id}/${ver.id}`}
                                                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition rounded-lg"
                                                title="View this version"
                                            >
                                                <EyeIcon size={13} />
                                            </Link>
                                        </div>

                                        {project.current_version_index === ver.id ? (
                                            <div className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-lg text-center border border-emerald-500/20">
                                                ● Active Version
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRollback(ver.id)}
                                                className="text-[11px] font-medium bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white py-1.5 px-3 rounded-lg transition border border-indigo-600/30 cursor-pointer active:scale-95"
                                            >
                                                Rollback to this version
                                            </button>
                                        )}
                                    </div>
                                )
                            }
                        })}

                    {isGenerating && (
                        <div className="flex items-start gap-2.5">
                            <div className="shrink-0 size-7 rounded-full bg-[#1A1F2C] border border-white/10 flex items-center justify-center">
                                <BotIcon size={13} className="text-indigo-400" />
                            </div>
                            <div className="bg-[#181D2A] p-3 px-4 rounded-2xl rounded-tl-md border border-gray-800 flex gap-1.5 items-center">
                                <span className="size-1.5 rounded-full animate-bounce bg-indigo-400" style={{ animationDelay: '0s' }} />
                                <span className="size-1.5 rounded-full animate-bounce bg-indigo-400" style={{ animationDelay: '0.15s' }} />
                                <span className="size-1.5 rounded-full animate-bounce bg-indigo-400" style={{ animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Subtle bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0F131F] to-transparent pointer-events-none" />
            </div>

            {/* Revision input area */}
            <div className="p-3 bg-[#121624] border-t border-gray-800/70 shrink-0">
                <form onSubmit={handleRevisions} className="relative flex items-center bg-[#1A1F2C] border border-gray-800 rounded-xl p-1.5 px-3 shadow-inner focus-within:border-indigo-500/60 transition" >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent text-gray-200 py-1 text-xs sm:text-sm focus:outline-none placeholder:text-gray-500 resize-none min-h-[24px] max-h-[140px] no-scrollbar leading-relaxed"
                        disabled={isGenerating}
                        rows={1}
                        placeholder="Request a change or revision..."
                    />
                    <button
                        type="submit"
                        disabled={isGenerating || !input.trim()}
                        className="ml-1.5 shrink-0 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:opacity-40 text-white rounded-lg transition shadow active:scale-95 cursor-pointer"
                    >
                        {isGenerating ? <Loader2Icon className="size-3.5 animate-spin" /> : <SendIcon size={14} />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Sidebar
