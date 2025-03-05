// ----------------------------------------------------------------------

// IF THIS TRANSLATION IS INCORRECT PLEASE IGNORE THIS AS THIS TRANSLATION IS FOR DEMO PURPOSES ONLY
// We are happy if you can help improve the translation by sending an email to support@minimals.cc.

// ----------------------------------------------------------------------

import * as yup from "yup";

const ru = {
  title: {
    page: 'Машины',
    navigation: 'Машины',
    list: 'Список машин',
    edit: 'Редактирование машины',
    create: 'Новая машина',
    view: 'Просмотр машины',
  },
  create: 'Добавить',
  pcs: 'шт.',
  form: {
    main_data: 'Основные данные',
    characteristics: 'Характеристика машины',
    manufacturer: 'Производитель',
    model: 'Модель',
    vin: 'VIN номер',
    customer: 'Клиент',
    destination: 'Пункт назначения доставки',
    year: 'Год выпуска',
    color: 'Цвет',
    lot_id: 'ID лота',
    buyer_id: 'ID покупателя',
    history: {
      title: 'История доставки',
      status: 'Статус',
      datetime: 'Дата и время',
    },
    photos: {
      title: 'Фотографии',
      select_category: 'Выберите категорию, чтобы посмотреть и загрузить фотографии'
    },
    documents: {
      title: 'Документы',
      name: 'Наименование',
      file: 'Файл'
    },
    edit_button: 'Сохранить',
    create_button: 'Создать',
  },
  view: {
    timeline: 'История доставки',
    photos: 'Фотографии',
    documents: 'Документы',
    empty_photos: 'Нет доступных фотографий.',
    empty_documents: 'Нет доступных документов.'
  },
  breadcrumb: {
    main: 'Машины',
    list: 'Список',
    edit: 'Редактирование',
    create: 'Создание',
    view: 'Просмотр',
  },
  validator: {
    manufacturer_required: 'Производитель обязателен',
    model_required: 'Модель обязательна',
    vin_required: 'VIN обязателен',
    characteristics: {
      year_required: 'Год обязателен',
      color_required: 'Цвет обязателен',
    },
    history: {
      status_required: 'Статус обязателен',
      datetime_required: 'Дата и время обязательны',
    },
    documents: {
      name_required: 'Наименование обязательно',
      file_required: 'Файл обязателен',
    },
  },
  filter: {
    status: 'Статус машины',
    destination: 'Пункт назначения доставки',
    customer: 'Клиент',
    search: 'Поиск...',
    vin: 'VIN номер (через пробел)',
  },
  table: {
    make: 'Марка машины',
    vin: 'VIN',
    destination: 'Пункт назначения доставки',
    customer: 'Клиент',
    status: 'Статус',
  },
  error: {
    create: 'Произошла ошибка при создании данных',
    edit: 'Произошла ошибка при сохранении данных',
    delete: 'Произошла ошибка при удалении данных',
    import: 'Произошла ошибка при импорте данных',
  },
  success: {
    create: 'Данные успешно созданы',
    edit: 'Данные успешно сохранены',
    delete: 'Данные успешно удалены',
    import: 'Данные успешно импортированы',
  },
  delete: {
    title: 'Подтверждение удаления',
    description: 'Вы уверены, что хотите удалить этих данных? \nЭто действие необратимо.',
  },
}

export default ru
