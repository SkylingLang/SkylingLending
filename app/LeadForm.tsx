"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

const getPhoneDigits = (value: string) => {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = digits.slice(1);
  } else if (digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
};

const formatPhone = (digits: string) => {
  if (!digits) return "";

  const area = digits.slice(0, 3);
  const first = digits.slice(3, 6);
  const second = digits.slice(6, 8);
  const third = digits.slice(8, 10);

  let value = "+7";

  if (area) value += ` (${area}`;
  if (area.length === 3) value += ")";
  if (first) value += ` ${first}`;
  if (second) value += `-${second}`;
  if (third) value += `-${third}`;

  return value;
};

const getCaretPosition = (formatted: string, localDigitCount: number) => {
  if (localDigitCount <= 0) return formatted.length;

  for (let index = 0; index < formatted.length; index += 1) {
    if (getPhoneDigits(formatted.slice(0, index + 1)).length >= localDigitCount) {
      return index + 1;
    }
  }

  return formatted.length;
};

export default function LeadForm() {
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const phone = phoneDigits || isPhoneFocused ? formatPhone(phoneDigits) || "+7 " : "";

  const handlePhoneBackspace = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") return;

    const input = event.currentTarget;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    if (start === null || end === null || start !== end) return;

    const previousChar = input.value[start - 1];

    if (!previousChar || /\d/.test(previousChar)) return;

    event.preventDefault();

    const localDigitsBeforeCursor = getPhoneDigits(input.value.slice(0, start));
    const removeIndex = localDigitsBeforeCursor.length - 1;

    if (removeIndex < 0) return;

    const nextDigits =
      phoneDigits.slice(0, removeIndex) + phoneDigits.slice(removeIndex + 1);
    const nextValue = formatPhone(nextDigits) || "+7 ";
    const nextCaret = getCaretPosition(nextValue, removeIndex);

    setPhoneDigits(nextDigits);

    requestAnimationFrame(() => {
      phoneInputRef.current?.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phoneDigits) {
      setError("Заполните имя и телефон");
      return;
    }

    if (phoneDigits.length !== 10) {
      setError("Введите полный номер телефона");
      return;
    }

    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setState("success");
      setName("");
      setPhoneDigits("");
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
          onChange={(event) => setName(event.target.value)}
          placeholder="Имя"
          required
          value={name}
        />
        <input
          aria-label="Телефон"
          inputMode="numeric"
          maxLength={18}
          name="phone"
          onChange={(event) => setPhoneDigits(getPhoneDigits(event.target.value))}
          onBlur={() => setIsPhoneFocused(false)}
          onFocus={() => setIsPhoneFocused(true)}
          onKeyDown={handlePhoneBackspace}
          pattern="^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
          placeholder="+7 (000) 000-00-00"
          ref={phoneInputRef}
          required
          type="tel"
          value={phone}
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
            <button type="button" onClick={() => setState("idle")}>
              Хорошо
            </button>
          </div>
        </div>
      )}
    </>
  );
}
