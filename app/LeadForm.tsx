"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("Заполните имя и телефон");
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
      setPhone("");
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
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder="🇰🇿  +7 (000) 000-00-00"
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
