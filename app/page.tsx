import LeadForm from "./LeadForm";
import MovingLessonSection from "./MovingLessonSection";

const benefitCards = [
  {
    icon: ":)",
    tone: "orange",
    title: "Уникальная система обучения",
    text: "",
  },
  {
    icon: "×",
    tone: "blue",
    title: "Поддержка куратора",
    text: "",
  },
  {
    icon: "≡",
    tone: "pink",
    title: "Практика с AI-ботом",
    text: "",
  },
  {
    icon: "✓",
    tone: "green",
    title: "Разговор с первых секунд",
    text: "",
  },
];

const fitCards = [
  {
    text: "Тем, кто давно учит английский, но не говорит",
    rotate: "-3deg",
  },
  {
    text: "Тем, у кого мало времени на обучение",
    rotate: "1deg",
  },
  {
    text: "Тем, кто хочет практиковать английский каждый день",
    rotate: "2deg",
  },
  {
    text: "Тем, кто боится свободно разговаривать и ошибаться",
    rotate: "-2deg",
  },
  {
    text: "Тем, кто хочет чувствовать себя уверенно в путешествиях и работе",
    rotate: "2deg",
  },
];

const lessonCards = [
  {
    number: "1",
    title: "Skyling — обучение нового поколения",
    text: "Ты не просто смотришь уроки, а сразу используешь английский на практике.",
  },
  {
    number: "2",
    title: "Что внутри платформы",
    text: "Краткая теория, практика после урока, повторение, AI-бот 24/7 и поддержка ментора на протяжении обучения.",
  },
  {
    number: "3",
    title: "Английский в твоей повседневной жизни",
    text: "Едешь в транспорте, летишь на отдых, идёшь на обед или просто есть 10 минут — открываешь мессенджер и практикуешь английский в любое время.",
  },
];

const trustCards = [
  {
    icon: "🤖",
    title: "AI-бот, который адаптируется под тебя",
    text: "Он поддержит разговор, исправит ошибки и поможет заговорить увереннее без стресса.",
  },
  {
    icon: "🌍",
    title: "Английский становится частью твоей жизни",
    text: "Практикуйся в транспорте, на обеде, в путешествии или перед сном — английский всегда под рукой.",
  },
  {
    icon: "⏱",
    title: "Практика без ожидания уроков",
    text: "Больше не нужно подстраиваться под преподавателя — открываешь мессенджер и начинаешь говорить.",
  },
  {
    icon: "⚡",
    title: "10–15 минут в день дают результат",
    text: "Ты не просто смотришь уроки, а постоянно говоришь, повторяешь и закрепляешь английский на практике.",
  },
  {
    icon: "💬",
    title: "Английский перестаёт быть предметом",
    text: "Он становится частью твоей повседневной жизни: простым, понятным и доступным каждый день.",
  },
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Skyling">
      Skyling
    </a>
  );
}

function Nav() {
  return (
    <header className="navShell">
      <Logo />
    </header>
  );
}

function ImageSlot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`imageSlot ${className}`} aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function CtaButton({ children = "Начать учить Английский с ИИ-Преподавателем 🔥" }) {
  return (
    <a className="blackCta" href="#lead">
      {children}
    </a>
  );
}

function BonusTape() {
  return (
    <div className="bonusTape" aria-label="Бонус">
      <div className="bonusTrack">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index}>🎁 Бонус</span>
        ))}
      </div>
    </div>
  );
}

function FooterInfo() {
  return (
    <footer className="footerInfo">
      <div className="footerInner">
        <div className="footerBrandMark" aria-label="Relitalk">
          R<span />
        </div>
        <div className="footerContacts">
          <p>
            Частная компания «ReliTalk Ltd»
            <br />
            Казахстан, Астана, Проспект Улы Дала, дом 58, кв. 116
            <br />
            БИН: 231040900076
          </p>
          <p>
            8 708 050 5757
            <br />
            relitalk.service@mail.ru
          </p>
        </div>
        <div className="footerSocials">
          <a href="#" aria-label="WhatsApp">
            ☎
          </a>
          <a href="#" aria-label="Instagram">
            ◎
          </a>
        </div>
        <div className="footerLinks">
          <a href="#">Оферта на заключение лицензионного договора</a>
          <a href="#">Политика по обработке персональных данных</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Nav />

      <section className="heroBlock">
        <div className="heroCircles" />
        <div className="heroPills">
          <h1>
            <span>Английский язык</span>
            <span>по современной методике!</span>
          </h1>
        </div>
        <div className="glassRibbon">
          Skyling - обучение нового поколения с ИИ препадователем!
        </div>
        <h2>
          <span className="heroOneLine">Устал? Есть всего 10 минут?</span>
          <br />
          <span className="heroThinText">
            <br />
            Этого достаточно, чтобы
            <br />
            открыть Telegram и начать
            <br />
            говорить прямо сейчас!
          </span>
        </h2>
        <ImageSlot label="Фото Человека" className="heroPerson" />
        <CtaButton />
      </section>

      <section className="benefitsBlock">
        <div className="benefitGrid">
          {benefitCards.map((card) => (
            <article className="benefit" key={card.title}>
              <div className={`benefitIcon ${card.tone}`}>{card.icon}</div>
              <p>
                <strong>{card.title}</strong>
                <br />
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="fitBlock" id="fit">
        <div className="flag" aria-label="British flag">
          <img src="/images/flags-uk-kz.png" alt="Флаги Великобритании и Казахстана" />
        </div>
        <div className="whitePanel fitTitle">
          <h2>Кому подойдет Skyling?</h2>
          <p>Если вы узнали себя хотя бы в одном пункте - наш курс для вас:</p>
        </div>
        <div className="fitCards">
          {fitCards.map((card, index) => (
            <article
              className="photoCard"
              key={card.text}
              style={{ ["--r" as string]: card.rotate }}
            >
              <ImageSlot label={`Фото ${index + 1}`} />
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <MovingLessonSection cards={lessonCards} />

      <BonusTape />

      <section className="bonusVideo">
        <div className="videoBox">
          <div className="videoPlaceholder">
            <ImageSlot label="Видео основателя" />
            <button aria-label="Смотреть видео" type="button">
              ▶
            </button>
          </div>
          <div className="videoText">
            <h2>3 эксклюзивных видео от основателя Relitalk</h2>
            <ul>
              <li>Как учить английский без зубрежки и страха</li>
              <li>Почему «ошибки» - это ваш лучший инструмент</li>
              <li>
                Как дойти до разговорного уровня, даже если вы вечно начинаете и
                бросаете
              </li>
            </ul>
            <p>
              Эти уроки не найти в открытом доступе - их получают только те, кто
              приходит на пробный урок
            </p>
          </div>
        </div>
        <CtaButton />
      </section>

      <section className="trustBlock" id="trust">
        <div className="whitePanel trustTitle">
          <h2>
            <span className="trustUnderline">Почему</span> нас выбирают?
          </h2>
          <p>Relitalk - это не просто курсы. Это система, которая работает.</p>
        </div>
        <div className="trustGrid">
          {trustCards.map((card) => (
            <article className="trustCard" key={card.title}>
              <span>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="leadBlock" id="lead">
        <div className="leadPanel">
          <div className="leadLeft">
            <h2>
              <span>Оставь заявку</span>
              И начни говорить
              <br />
              на Английском свободно!
            </h2>
            <div className="leadBenefits">
              <p>▥ Определим ваш уровень английского</p>
              <p>▣ Покажем платформу и формат обучения</p>
              <p>▱ Расскажем, как легко запомнить 500 слов за пару минут</p>
              <p>▢ Составим персональный план изучения</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>

      <FooterInfo />
    </main>
  );
}
