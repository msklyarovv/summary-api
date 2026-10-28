import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      name: 'Михаил Скляров',
      description:
        'Восемь лет в разработке, последние четыре — в банковском продукте с реальными нагрузками. ' +
        'Работаю над 30+ сервисами в микрофронтовом приложении крупнейшего российского банка для сотрудников выездного канала в роли лид-разработчика. ' +
        'Занимаюсь не только бизнес-задачами, но и аналитикой, оптимизацией, инфраструктурными доработками, составлением технических целей. ' +
        'Пишу код, за который не стыдно. Грамотно балансирую между «Бизнес первичен, технологии вторичны» и «Сделай из ***** и палок — будет бизнесу подарок».',
      email: 'm.sklyarovv@gmail.com',
      phone: '+7 999 696-20-32',
      telegram: '@msklyarovv',
      links: {
        create: [
          { label: 'GitHub', url: 'https://github.com/msklyarovv' },
          { label: 'Habr', url: 'https://habr.com/ru/users/msklyarovv' },
          { label: 'Telegram', url: 'https://t.me/msklyarovv' },
        ],
      },
      skills: {
        create: [
          // Frontend
          { name: 'JavaScript', category: 'Frontend' },
          { name: 'TypeScript', category: 'Frontend' },
          { name: 'React', category: 'Frontend' },
          { name: 'Next.js', category: 'Frontend' },
          { name: 'Gatsby', category: 'Frontend' },
          { name: 'Vue', category: 'Frontend' },
          { name: 'Redux / Redux Toolkit / Redux-Saga', category: 'Frontend' },
          { name: 'Styled Components', category: 'Frontend' },
          { name: 'Material UI', category: 'Frontend' },
          { name: 'HTML5 / CSS3 / SASS', category: 'Frontend' },
          // Mobile
          { name: 'React Native', category: 'Mobile' },
          { name: 'Expo', category: 'Mobile' },
          { name: 'PWA', category: 'Mobile' },
          // Backend
          { name: 'Node.js', category: 'Backend' },
          { name: 'Express', category: 'Backend' },
          { name: 'NestJS', category: 'Backend' },
          { name: 'GraphQL', category: 'Backend' },
          { name: 'PostgreSQL', category: 'Backend' },
          { name: 'MySQL', category: 'Backend' },
          { name: 'Prisma', category: 'Backend' },
          // DevOps
          { name: 'Docker', category: 'DevOps' },
          { name: 'Kubernetes', category: 'DevOps' },
          { name: 'Nginx', category: 'DevOps' },
          { name: 'GitLab CI', category: 'DevOps' },
          { name: 'Jenkins', category: 'DevOps' },
          { name: 'Git / BitBucket', category: 'DevOps' },
          // Testing
          { name: 'Jest', category: 'Testing' },
          { name: 'Cypress', category: 'Testing' },
          { name: 'Storybook', category: 'Testing' },
          // Security & Monitoring
          { name: 'Grafana', category: 'Monitoring' },
          { name: 'Sentry', category: 'Monitoring' },
          { name: 'Apache Superset', category: 'Monitoring' },
          { name: 'Keycloak', category: 'Security' },
          { name: 'OWASP Top 10', category: 'Security' },
          { name: 'BurpSuite', category: 'Security' },
        ],
      },
      experience: {
        create: [
          {
            order: 0,
            company: 'Альфа-Банк (вендор: АО «Белл Интегратор»)',
            position: 'Lead Frontend Developer',
            startDate: new Date('2022-09-01'),
            endDate: null,
            stack: [
              'React',
              'TypeScript',
              'Redux Toolkit',
              'Keycloak',
              'Apache Superset',
              'Grafana',
              'Sentry',
              'Kubernetes',
              'PWA',
              'Jest',
              'Cypress',
              'GitLab CI',
            ],
            achievements: [
              'Разрабатываю и поддерживаю микрофронтовое приложение: 30+ независимых сервисов, тысячи активных пользователей ежедневно.',
              'Переработал систему авторизации, интегрировал Keycloak; закрыл 15+ критических уязвимостей, выявленных при аудите.',
              'Построил аналитическую платформу на Apache Superset с нуля: 10+ дашбордов, 100+ чартов, интеграция с внутренними источниками данных.',
              'Реализовал встраиваемый сервис ЭДО для 5 000+ сотрудников.',
              'Запустил 10+ новых сервисов под новые направления дирекции.',
              'Переработал 30+ сервисов при переходе на обновлённый kit компонентов.',
              'Выстроил процесс покрытия тестами: от написания до автоматического ревью coverage.',
              'Интегрировал Grafana и Sentry во все модули — диагностика production-инцидентов ускорилась кратно.',
              'Перевёл все модули на ConfigMap при миграции с Mesos на Kubernetes: время поставки в production сократилось на 8%.',
              'Решил проблему ошибок загрузки chunk`ов после релизов, внедрив Rolling Update.',
              'Инициировал и реализовал переход на PWA для неподдерживаемых устройств.',
              'Оптимизировал загрузку страниц: lazy load компонентов, анализ bundle, устранение критических путей рендеринга.',
            ],
          },
          {
            order: 1,
            company: 'SberDevices (ТК РФ: ООО «СалютДевайсы»)',
            position: 'Senior Frontend Developer',
            startDate: new Date('2022-09-01'),
            endDate: new Date('2025-03-01'),
            stack: [
              'React',
              'TypeScript',
              'Next.js',
              'Gatsby',
              'Node.js',
              'Express',
              'Redux',
              'Storybook',
              'Jest',
              'Cypress',
              'Sentry',
              'CDN',
              'PostgreSQL',
              'GitLab CI',
            ],
            achievements: [
              'Полностью переработал портал поддержки: системы обратной связи, формы взаимодействия с клиентами.',
              'Разработал систему динамических полей и блоков — все формы и страницы настраиваются через админ-панель без участия разработчика. Результат: ~40 часов/месяц освободилось у команды.',
              'Подключил Sentry, снизил количество production-ошибок на 20%.',
              'Настроил и перевёл на целевое использование CDN: снизил нагрузку на серверы, ускорил загрузку страниц.',
              'Поднял coverage: e2e и компонентное тестирование до 80%+ в портале, с 30% до 70% по branch в интернет-магазине.',
              'Перевёл магазин с Gatsby на Next.js, полностью переработал legacy-код.',
              'Настроил переход на новую систему эквайринга.',
              'Разработал библиотеку компонентов с покрытием тестами и Storybook.',
              'Интегрировал 10+ вендорных решений, в том числе сложную систему чат-ботов и чатов с операторами.',
              'Наладил scrum-процесс, выстроил работу с технической документацией и техдолгом.',
            ],
          },
          {
            order: 2,
            company: 'ООО «Дунайс» (аутстафф)',
            position: 'Fullstack Developer',
            startDate: new Date('2021-04-01'),
            endDate: new Date('2022-08-01'),
            stack: [
              'React Native',
              'React',
              'Node.js',
              'Express',
              'NestJS',
              'PostgreSQL',
              'TypeScript',
              'Active Directory',
            ],
            achievements: [
              'Wagoonmaster (апр–окт 2021): мобильное приложение для крупнейшей ЖД-логистической компании СНГ. Интеграция со сканерами и считывателями, ролевая модель на AD, сбор метрик по 90%+ действий пользователей, портал координаторов.',
              'Safe Workplace (ноя 2021–авг 2022): внутреннее приложение для сотрудников складов Amazon. Каркас приложения, анонимные отчёты с геолокацией, NLP-чат-бот для первичной обработки инцидентов, система динамических полей, admin panel и kit компонентов.',
            ],
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'Alfa-Bank Mobile Platform',
            description:
              'Микрофронтовое приложение для 5 000+ сотрудников выездного канала Альфа-Банка. ' +
              '30+ независимых сервисов, Kubernetes, Keycloak, Apache Superset.',
            url: null,
          },
          {
            name: 'SberDevices Support Portal',
            description:
              'Полностью переработанный портал поддержки пользователей SberDevices. ' +
              'Система динамических полей и блоков, интеграция чат-ботов, 80%+ test coverage.',
            url: null,
          },
          {
            name: 'SberDevices E-commerce',
            description:
              'Миграция интернет-магазина с Gatsby на Next.js, 10+ продающих лендингов. ' +
              'CDN-оптимизация, новая система эквайринга, библиотека компонентов со Storybook.',
            url: null,
          },
          {
            name: 'Wagoonmaster',
            description:
              'React Native приложение для сотрудников крупнейшей ЖД-логистической компании СНГ. ' +
              'Интеграция со сканерами, ролевая модель на Active Directory, метрики по 90%+ действий.',
            url: null,
          },
          {
            name: 'Safe Workplace (Amazon)',
            description:
              'Внутреннее приложение для сотрудников складов Amazon. ' +
              'Анонимные отчёты с геолокацией, NLP-чат-бот, система динамических полей.',
            url: null,
          },
          {
            name: 'summary-api',
            description:
              'Этот проект — цифровая визитка на NestJS + GraphQL + Prisma + Docker.',
            url: 'https://github.com/msklyarovv/summary-api',
          },
        ],
      },
    },
  });

  console.log(`✅ Профиль заполнен: ${profile.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
