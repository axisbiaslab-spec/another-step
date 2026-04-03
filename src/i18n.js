import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "hero.title": "Another Step",
            "hero.subtitle": "An immersive musical performance",
            "aboutMe.title": "About Me",
            "aboutMe.text": "Engineer, musician, and philosopher exploring the intersection of technology, sound, and consciousness.",
            "aboutShow.title": "About the Show",
            "aboutShow.text": "A conceptual audiovisual journey challenging our perception of reality.",
            "footer.socials": "Connect with us:",
            "introHeader": "The Path",
            "introText": "We embark on the path to wisdom, and this path will not be easy. True freedom and genuine joy are not given freely—they are forged through perseverance. Ahead lie stern trials and heavy choices. But do not yield. Together, we will meet these challenges, resolve our doubts, and inevitably find the way.",
            "circleHeader": "The Circle",
            "circleText": "Observe this circle. It stands as the boundary of your will. Everything within it—your thoughts, your choices, your actions—is entirely within your power. Everything outside—fate, the opinions of others, the unpredictable course of the world—is beyond your control. Do not squander your strength on what you cannot change. Master what lies within.",
            "choiceHeader": "Choice",
            "choiceText": "Every moment of your life is a choice, and the sum of these decisions has brought you to this very point. Here, in this space, you will be called to make conscious choices. Remember: each manifest decision alters our direction, opening some paths and closing others forever. The road we travel depends on the will you exercise."
        }
    },
    ru: {
        translation: {
            "hero.title": "Another Step",
            "hero.subtitle": "Иммерсивный аудиовизуальный перформанс",
            "aboutMe.title": "Обо мне",
            "aboutMe.text": "Инженер, музыкант и философ, исследующий пересечение технологий, звука и сознания.",
            "aboutShow.title": "О шоу",
            "aboutShow.text": "Концептуальное аудиовизуальное путешествие, бросающее вызов нашему восприятию реальности.",
            "footer.socials": "Свяжитесь с нами:",
            "introHeader": "Путь",
            "introText": "Мы вступаем на путь к мудрости, и путь этот не будет легким. Истинная свобода и подлинная радость не даются даром — они куются в преодолении. Впереди нас ждут суровые испытания и тяжелые выборы. Но не отступай. Вместе мы встретим эти вызовы, разрешим сомнения и непременно отыщем дорогу.",
            "circleHeader": "Круг",
            "circleText": "Обрати внимание на этот круг. Он символизирует границу твоей воли. Всё, что находится внутри — твои мысли, твои выборы и твои поступки — всецело в твоей власти. Всё, что остается снаружи — судьба, мнения других людей и непредсказуемый ход мира — тебе неподвластно. Не растрачивай силы на то, что не можешь изменить. Овладей тем, что внутри.",
            "choiceHeader": "Выбор",
            "choiceText": "Каждый миг твоей жизни — это выбор, и именно сумма этих решений привела тебя в сегодняшнюю точку. Здесь, на протяжении шоу, тебе предстоит совершать явные выборы. Помни: каждое принятое решение меняет направление нашего движения, открывая одни тропы и навсегда закрывая другие. Путь, по которому мы идем, зависит от твоей воли."
        }
    },
    sr: {
        translation: {
            "hero.title": "Another Step",
            "hero.subtitle": "Imerzivni muzički performans",
            "aboutMe.title": "O meni",
            "aboutMe.text": "Inženjer, muzičar i filozof koji istražuje raskrsnicu tehnologije, zvuka i svesti.",
            "aboutShow.title": "O predstavi",
            "aboutShow.text": "Konceptualno audiovizuelno putovanje koje izaziva našu percepciju realnosti.",
            "footer.socials": "Povežite se sa nama:",
            "introHeader": "Put",
            "introText": "Stupamo na put ka mudrosti, i taj put neće biti lak. Istinska sloboda i prava radost ne dobijaju se besplatno — one se kuju u prevazilaženju. Pred nama su stroga iskušenja i teški izbori. Ali ne odustajte. Zajedno ćemo se suočiti sa ovim izazovima, razrešiti sumnje i sigurno pronaći put.",
            "circleHeader": "Krug",
            "circleText": "Obrati pažnju na ovaj krug. On simbolizuje granicu tvoje volje. Sve što je unutar njega — tvoje misli, tvoji izbori i tvoji postupci — potpuno je u tvojoj moći. Sve što ostaje spolja — sudbina, mišljenja drugih ljudi i nepredvidivi tok sveta — van je tvoje kontrole. Ne gubi snagu na ono što ne možeš promeniti. Ovladaj onim što je unutra.",
            "choiceHeader": "Izbor",
            "choiceText": "Svaki trenutak tvog života je izbor, i upravo je zbir tih odluka doveo tebe do ove tačke. Ovde, tokom predstave, donosićeš jasne izbore. Zapamti: svaka doneta odluka menja pravac našeg kretanja, otvarajući jedne staze i zauvek zatvarajući druge. Put kojim idemo zavisi od tvoje volje."
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'ru', 'sr'],
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
