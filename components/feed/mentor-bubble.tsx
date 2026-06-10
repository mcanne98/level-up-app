'use client'

interface Props {
  message: string
  avatarEmoji?: string
}

export function MentorBubble({ message, avatarEmoji = '🤖' }: Props) {
  return (
    <div className="flex items-end gap-3 px-4 py-2">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-xl shadow-lg">
        {avatarEmoji}
      </div>
      <div className="bg-white/15 backdrop-blur-sm rounded-3xl rounded-bl-sm px-4 py-3 border border-white/20 max-w-xs">
        <p className="text-white text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
