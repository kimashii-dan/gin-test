import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
const resources = {
  en: {
    translation: {
      langs: {
        en: "English",
        ru: "Russian",
      },
      heroText: {
        title: {
          stroke1: "The Marketplace",
          stroke2: "Made for Students.",
        },
        description:
          "A student marketplace with an AI Price Advisor. Buy, sell, and get instant price suggestions to save money and make smarter deals",
      },
      buttons: {
        createListing: "Create listing",
        goToHome: "Go to Home",
        getStarted: "Get Started",
      },
      search: {
        placeholder: "Search for anything",
        result: {
          found: "Found",
          results: "results for",
        },
      },
      listingCard: {
        status: {
          sold: "Sold",
          available: "Available",
        },
        like: "Like",
      },
      listingForm: {
        title: {
          label: "Title",
          placeholder: "Enter title of the product",
        },
        description: {
          label: "Description",
          placeholder: "Enter description of the product",
        },
        category: {
          label: "Categories",
          categories: {
            furniture: "Furniture",
            electronics: "Electronics",
            books: "Books",
            clothing: "Clothing",
            services: "Services",
            null: "All",
          },
        },
        price: {
          label: "Price",
          placeholder: "Add your price",
        },
        images: {
          label: "Images",
          placeholder: " Click to upload or drag and drop",
        },
        buttons: {
          aiSuggestion: {
            name: "Get AI suggestion",
            loading: "Getting suggestion...",
          },
          create: {
            name: "Create",
            loading: "Creating...",
          },
          update: {
            name: "Update",
            loading: "Updating...",
          },
        },
      },
      aiReport: {
        title: "AI price suggestion",
        confidence: {
          name: "confidence",
          low: "low",
          medium: "medium",
          high: "high",
        },
      },

      listingDetails: {
        buttons: {
          update: "Update",
          delete: "Delete",
          share: "Share",
          contactTelegram: "Contact via Telegram",
          contactEmail: "Contact via Email",
          rate: "Rate",
        },
        description: "Description",
        status: {
          sold: "Sold",
          available: "Available",
        },
        like: "Like",
        owner: {
          memberSince: "Member since",
          university: "University",
        },
        posted: "Posted",
        deletingAlert: "Do you really want to delete this beautiful listing?",
      },
      yes: "Yes",
      no: "No",
      unknown: "Unknown",
      anonymous: "Anonymous",
      listings: "Listings",
      profile: {
        title: "Profile",
        account: "Account",
        completeTitle: "Complete profile",
        joined: "Joined",
        buttons: {
          edit: "Edit",
          logout: "Logout",
          save: "Save",
          cancel: "Cancel",
        },
        name: "Name",
        fields: {
          university: "Add your university",
          phone: "Add your phone",
          telegram: "Add your telegram",
          bio: "Add bio",
          name: "Enter your name",
          email: "Enter your email",
        },
        info: {
          name: "Info",
          email: "Email",
          university: "University",
        },
        contacts: {
          name: "Contacts",
          phone: "Phone",
          telegram: "Telegram",
        },
        aboutMe: {
          name: "About me",
        },
        avatar: {
          uploader: {
            selected: "Selected",
            size: "Size",
            buttons: {
              upload: "Upload avatar",
              changeImage: "Change image",
            },
          },
        },
      },
      wishlist: "Wishlist",
      errors: {
        wishlist: {
          loading: "Error loading wishlist",
          absence: "No items in wishlist",
        },
        home: {
          loading: "Error loading listings",
        },
        account: {
          loading: "Error loading account",
          listings: {
            absence: "No listings available",
          },
        },
        profile: {
          loading: "Error loading profile",
        },
        listing: {
          loading: "Error loading listing",
        },
      },
      auth: {
        login: {
          title: "Login",
          description: "Welcome back! Please sign in to continue.",
          email: {
            label: "Email",
            placeholder: "Enter your email",
          },
          password: {
            label: "Password",
            placeholder: "Enter your password",
          },
          noAccount: "Don't have an account yet?",
        },
        register: {
          title: "Register",
          description: "Create your account to get started.",
          email: {
            label: "Email",
            placeholder: "Enter your email",
          },
          password: {
            label: "Password",
            placeholder: "Enter your password",
          },
          confirmPassword: {
            label: "Confirm password",
            placeholder: "Enter your password again",
          },
          accountExists: "Already have an account?",
        },
      },
      socials: "Socials",
    },
  },
  ru: {
    translation: {
      langs: {
        en: "Английский",
        ru: "Русский",
      },
      heroText: {
        title: {
          stroke1: "Mаркетплейс",
          stroke2: "Для студентов.",
        },
        description:
          "Маркетплейс с AI-советником по ценам: продавай, покупай и получай мгновенные рекомендации, чтобы экономить и делать выгодные сделки.",
      },
      buttons: {
        createListing: "Создать объявление",
        goToHome: "Вернуться на главную страницу",
        getStarted: "Попробовать",
      },
      search: {
        placeholder: "Начните поиск...",
        result: {
          found: "Найдено",
          results: "результатов для",
        },
      },
      listingCard: {
        status: {
          sold: "Продано",
          available: "Открыто",
        },
        like: "Лайкнуть",
      },
      listingForm: {
        title: {
          label: "Название",
          placeholder: "Введите название объявления",
        },
        description: {
          label: "Описание",
          placeholder: "Введите описание",
        },
        category: {
          label: "Категории",
          categories: {
            furniture: "Мебель",
            electronics: "Электроника",
            books: "Книги",
            clothing: "Одежда",
            services: "Услуги",
            null: "Все",
          },
        },
        price: {
          label: "Цена",
          placeholder: "Введите цену  ",
        },
        images: {
          label: "Фото",
          placeholder: "Нажмите для загрузки или перетащите фото",
        },
        buttons: {
          aiSuggestion: {
            name: "Получить рекомендацию ИИ",
            loading: "ИИ думает...",
          },
          create: {
            name: "Создать",
            loading: "Создание...",
          },
          update: {
            name: "Обновить",
            loading: "Обновление...",
          },
        },
      },
      aiReport: {
        title: "Рекомендация от ИИ",
        confidence: {
          name: "уверенность",
          low: "низкая",
          medium: "средняя",
          high: "высокая",
        },
      },
      listingDetails: {
        buttons: {
          update: "Обновить",
          delete: "Удалить",
          share: "Поделиться",
          contactTelegram: "Связаться по Телеграмму",
          contactEmail: "Связаться по почте",
          rate: "Оценить",
        },
        description: "Описание",
        status: {
          sold: "Продано",
          available: "Открыто",
        },
        like: "Лайкнуть",
        owner: {
          memberSince: "Зарегистрирован с",
          university: "Университет",
        },
        posted: "Опубликовано",
        deletingAlert:
          "Вы действительно хотите удалить это прекрасное объявление?",
      },
      yes: "Да",
      no: "Нет",
      unknown: "Неизвестно",
      anonymous: "Без имени",
      listings: "Объявления",
      profile: {
        title: "Профиль",
        account: "Аккаунт",
        completeTitle: "Завершить профиль",
        joined: "Присоединился",
        buttons: {
          edit: "Редактировать",
          logout: "Выйти",
          save: "Сохранить",
          cancel: "Отменить",
        },
        fields: {
          university: "Добавить университет",
          phone: "Добавьте телефон",
          telegram: "Добавьте телеграм",
          bio: "Добавьте что-нибудь о себе",
          name: "Введите свое имя",
          email: "Введите почту",
        },
        name: "Имя",
        info: {
          name: "Информация",
          email: "Почта",
          university: "Университет",
        },
        contacts: {
          name: "Контакты",
          phone: "Телефон",
          telegram: "Телеграм",
        },
        aboutMe: {
          name: "О себе",
        },
        avatar: {
          uploader: {
            selected: "Выбрано",
            size: "Размер",
            buttons: {
              upload: "Загрузить аватар",
              changeImage: "Поменять аватар",
            },
          },
        },
      },
      wishlist: "Вишлист",
      errors: {
        wishlist: {
          loading: "Ошибка загрузки вишлиста",
          absence: "У вас пока нет сохраненных объявлений",
        },
        home: {
          loading: "Ошибка загрузки объявлений",
        },
        account: {
          loading: "Ошибка загрузки аккаунта",
          listings: {
            absence: "Не имеются объявления",
          },
        },
        profile: {
          loading: "Ошибка загрузки профиля",
        },
        listing: {
          loading: "Ошибка загрузки объявления",
        },
      },
      auth: {
        login: {
          title: "Войти",
          description: "Пожалуйста, войдите в систему, чтобы продолжить.",
          email: {
            label: "Почта",
            placeholder: "Введите свою почту",
          },
          password: {
            label: "Пароль",
            placeholder: "Введите пароль",
          },
          noAccount: "Все еще нет аккаунта?",
        },
        register: {
          title: "Зарегистрироваться",
          description: "Создайте свою учетную запись, чтобы начать работу.",
          email: {
            label: "Почта",
            placeholder: "Введите свою почту",
          },
          password: {
            label: "Пароль",
            placeholder: "Введите пароль",
          },
          confirmPassword: {
            label: "Подтвердите пароль",
            placeholder: "Введите пароль еще раз",
          },
          accountExists: "Уже имеется аккаунт?",
        },
      },
      socials: "Медиа",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
