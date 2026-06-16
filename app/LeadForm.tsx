"use client";

import { KeyboardEvent, useRef, useState, FormEvent } from "react";

const PREFIX = "+7 ";

const getDigits = (val: string): string => {
  let d = val.replace(/\D/g, "");
  if (d.startsWith("7")) d = d.slice(1);
  else if (d.startsWith("8")) d = d.slice(1);
  return d.slice(0, 10);
};

const formatPhone = (digits: string): string => {
  if (!digits) return "";
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 8);
  const d = digits.slice(8, 10);
  let v = PREFIX;
  if (a) v += `(${a}`;
  if (a.length === 3) v += ") ";
  if (b) v += b;
  if (b.length === 3) v += `-${c || ""}`;
  if (c.length === 2) v += `-${d}`;
  return v;
};

const caretAfterDigits = (formatted: string, digitCount: number): number => {
  if (digitCount <= 0) return PREFIX.length;
  const suffix = formatted.slice(PREFIX.length);
  let seen = 0;
  for (let i = 0; i < suffix.length; i++) {
    if (/\d/.test(suffix[i])) seen++;
    if (seen >= digitCount) return PREFIX.length + i + 1;
  }
  return formatted.length;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [focused, setFocused] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  const displayValue = focused || digits ? formatPhone(digits) || PREFIX : "";

  const commitDigits = (next: string, caretDigitCount: number) => {
    setDigits(next);
    requestAnimationFrame(() => {
      const formatted = formatPhone(next) || PREFIX;
      const c = caretAfterDigits(formatted, caretDigitCount);
      phoneRef.current?.setSelectionRange(c, c);
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    // Block cursor/selection from entering the prefix
    if ((e.key === "ArrowLeft" || e.key === "Home") && start <= PREFIX.length && !e.shiftKey) {
      e.preventDefault();
      input.setSelectionRange(PREFIX.length, PREFIX.length);
      return;
    }

    if (e.key === "Backspace") {
      // Block deleting into / past prefix
      if (start === end && start <= PREFIX.length) {
        e.preventDefault();
        return;
      }

      // Backspace over a formatting character (non-digit)
      if (start === end) {
        const ch = input.value[start - 1];
        if (ch && !/\d/.test(ch)) {
          e.preventDefault();
          const digitsBefore = getDigits(input.value.slice(PREFIX.length, start - 1));
          const removeIdx = digitsBefore.length - 1;
          if (removeIdx < 0) return;
          const next = digits.slice(0, removeIdx) + digits.slice(removeIdx + 1);
          commitDigits(next, removeIdx);
        }
      }
    }

    if (e.key === "Delete" && start < PREFIX.length) {
      e.preventDefault();
      input.setSelectionRange(PREFIX.length, PREFIX.length);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const next = getDigits(val);            // always max 10 digits
    const formatted = formatPhone(next) || PREFIX;
    setDigits(next);
    requestAnimationFrame(() => {
      const c = caretAfterDigits(formatted, next.length);
      phoneRef.current?.setSelectionRange(c, c);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !digits) { setError("Заполните имя и телефон"); return; }
    if (digits.length !== 10) { setError("Введите полный номер телефона"); return; }
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: displayValue }),
      });
      if (!res.ok) throw new Error();
      setState("success");
      setName("");
      setDigits("");
    } catch {
      setState("error");
      setError("Не получилось отправить заявку. Попробуйте еще раз.");
    }
  };

  return (
    <>
      <form className="leadForm" onSubmit={handleSubmit}>
        <span>Бонус!</span>
        <p>
          Открой доступ к уникальной платформе по изучению Английского и получи
          от нас бесплатный доступ к ИИ преподавателю на весь курс обучения.
        </p>
        <input
          aria-label="Имя"
          name="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          required
          value={name}
        />
        <input
          aria-label="Телефон"
          inputMode="numeric"
          maxLength={18}
          name="phone"
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            // Ensure cursor lands after prefix, not at start
            requestAnimationFrame(() => {
              const c = caretAfterDigits(formatPhone(digits) || PREFIX, digits.length);
              phoneRef.current?.setSelectionRange(c, c);
            });
          }}
          onKeyDown={handleKeyDown}
          placeholder="+7 (___) ___-__-__"
          ref={phoneRef}
          required
          type="tel"
          value={displayValue}
        />
        {error && <strong className="leadError">{error}</strong>}
        <button disabled={state === "loading"} type="submit">
          {state === "loading" ? "Отправляем..." : "Открыть доступ к платформе."}
        </button>
        <small>
          Мы не передаем данные третьим лицам.
          <br />
          Политика конфиденциальности
        </small>
      </form>

      {state === "success" && (
        <div className="successOverlay" role="dialog" aria-modal="true">
          <div className="successModal">
            <h2>Контакт успешно сохранён</h2>
            <p>Мы получили вашу заявку и скоро свяжемся с вами.</p>
            <button type="button" onClick={() => setState("idle")}>Хорошо</button>
          </div>
        </div>
      )}
    </>
  );
}