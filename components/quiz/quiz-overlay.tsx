'use client'

import { useState } from 'react'
import type { Quiz } from '@/types'
import { Button } from '@/components/ui/button'

interface Props {
  quiz: Quiz
  onComplete: (correct: boolean, score: number) => void
}

export function QuizOverlay({ quiz, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selected) return
    const option = quiz.options.find(o => o.id === selected)
    const correct = option?.is_correct ?? false
    setSubmitted(true)
    setTimeout(() => {
      onComplete(correct, correct ? 100 : 50)
    }, 1800)
  }

  const getOptionStyle = (optionId: string, isCorrect: boolean) => {
    if (!submitted) {
      return selected === optionId
        ? 'bg-violet-600 border-violet-400 text-white'
        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
    }
    if (isCorrect) return 'bg-emerald-500 border-emerald-400 text-white'
    if (selected === optionId && !isCorrect) return 'bg-red-500 border-red-400 text-white'
    return 'bg-white/5 border-white/10 text-white/40'
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">🧠</div>
        <h2 className="text-xl font-black text-white">Quick Check!</h2>
      </div>

      {/* Question */}
      <div className="bg-white/10 rounded-3xl p-5 border border-white/20">
        <p className="text-white text-lg font-semibold leading-snug">{quiz.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {quiz.options.map(option => (
          <button
            key={option.id}
            disabled={submitted}
            onClick={() => setSelected(option.id)}
            className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 ${getOptionStyle(
              option.id,
              option.is_correct
            )}`}
          >
            <span className="mr-2">
              {submitted && option.is_correct ? '✅' : submitted && selected === option.id && !option.is_correct ? '❌' : '•'}
            </span>
            {option.option_text}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {submitted && quiz.explanation && (
        <div className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-500/30">
          <p className="text-emerald-300 text-sm font-medium">💡 {quiz.explanation}</p>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          size="lg"
          className="w-full"
        >
          Submit Answer
        </Button>
      )}

      {submitted && (
        <div className="text-center py-2">
          <div className="text-3xl mb-1">
            {quiz.options.find(o => o.id === selected)?.is_correct ? '🎉' : '💪'}
          </div>
          <p className="text-white/70 text-sm">
            {quiz.options.find(o => o.id === selected)?.is_correct
              ? 'Correct! Keep going!'
              : 'Good try! Check the explanation above.'}
          </p>
        </div>
      )}
    </div>
  )
}
