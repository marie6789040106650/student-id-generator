export interface StudentData {
  layout: 'vertical' | 'horizontal';
  schoolName: string;
  studentName: string;
  studentId: string;
  major: string;
  issueDate: string;
  expiryDate: string;
  themeColor: string;
  photoUrl: string | null;
  logoUrl: string | null;
  address: string;
  notes: string;
  showChip: boolean;
  emergencyNumber: string;
}

export type Language = 'en-US' | 'zh-CN' | 'ru-RU' | 'pl-PL';

export interface Translation {
  title: string;
  autoFill: string;
  vertical: string;
  horizontal: string;
  schoolName: string;
  studentName: string;
  studentId: string;
  major: string;
  issueDate: string;
  expiryDate: string;
  photo: string;
  selectFile: string;
  generate: string;
  noFileSelected: string;
  logo: string;
  clear: string;
  themeColor: string;
  address: string;
  notes: string;
  downloadFront: string;
  downloadBack: string;
  generating: string;
  showChip: string;
  // Card specific labels
  cardholder: string;
  authorizedSignature: string;
  emergencyContact: string;
  propertyOf: string;
  instructions: string;
  notTransferable: string;
  emergencyNumberLabel: string;
}

export const translations: Record<Language, Translation> = {
  'en-US': {
    title: 'Student ID Generator',
    autoFill: 'Auto Fill (AI)',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    schoolName: 'School Name',
    studentName: 'Student Name',
    studentId: 'Student ID',
    major: 'Department/Major',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    photo: 'Photo',
    selectFile: 'Select File',
    generate: 'Generate AI Portrait',
    noFileSelected: 'No file selected',
    logo: 'Logo',
    clear: 'Clear',
    themeColor: 'Theme Color',
    address: 'Address',
    notes: 'Notes',
    downloadFront: 'Download Front',
    downloadBack: 'Download Back',
    generating: 'Generating...',
    showChip: 'Show Smart Chip',
    cardholder: 'Student / Cardholder',
    authorizedSignature: 'Authorized Signature',
    emergencyContact: 'Emergency Contact',
    propertyOf: 'This card is the property of',
    instructions: 'It must be carried at all times and presented to University officials upon request. If found, please return to the address above.',
    notTransferable: 'Not transferable. Void if altered.',
    emergencyNumberLabel: 'Emergency Phone',
  },
  'zh-CN': {
    title: '学生证生成器',
    autoFill: '自动填充 (AI)',
    vertical: '竖版',
    horizontal: '横版',
    schoolName: '学校名称',
    studentName: '学生姓名',
    studentId: '学号',
    major: '院系/专业',
    issueDate: '签发日期',
    expiryDate: '有效期至',
    photo: '照片',
    selectFile: '选择文件',
    generate: '生成 AI 头像',
    noFileSelected: '未选择任何文件',
    logo: '校徽',
    clear: '清除',
    themeColor: '主题颜色',
    address: '地址',
    notes: '备注',
    downloadFront: '下载正面',
    downloadBack: '下载背面',
    generating: '生成中...',
    showChip: '显示智能芯片',
    cardholder: '学生 / 持卡人',
    authorizedSignature: '持卡人签名',
    emergencyContact: '紧急联系',
    propertyOf: '本卡归属',
    instructions: '请随身携带此卡，并应校方要求出示。如捡获此卡，请归还至上述地址。',
    notTransferable: '不得转让。涂改无效。',
    emergencyNumberLabel: '紧急联系电话',
  },
  'ru-RU': {
    title: 'Генератор Студенческих',
    autoFill: 'Автозаполнение (AI)',
    vertical: 'Вертикальный',
    horizontal: 'Горизонтальный',
    schoolName: 'Название школы',
    studentName: 'Имя студента',
    studentId: 'Номер студенческого',
    major: 'Факультет',
    issueDate: 'Дата выдачи',
    expiryDate: 'Действителен до',
    photo: 'Фото',
    selectFile: 'Выбрать файл',
    generate: 'Создать AI портрет',
    noFileSelected: 'Файл не выбран',
    logo: 'Логотип',
    clear: 'Очистить',
    themeColor: 'Цвет темы',
    address: 'Адрес',
    notes: 'Примечания',
    downloadFront: 'Скачать (Перед)',
    downloadBack: 'Скачать (Зад)',
    generating: 'Генерация...',
    showChip: 'Показать чип',
    cardholder: 'Студент / Владелец',
    authorizedSignature: 'Подпись владельца',
    emergencyContact: 'Экстренная связь',
    propertyOf: 'Эта карта является собственностью',
    instructions: 'Ее необходимо всегда носить с собой и предъявлять по требованию. Если нашли, верните по адресу выше.',
    notTransferable: 'Не подлежит передаче.',
    emergencyNumberLabel: 'Экстренный номер',
  },
  'pl-PL': {
    title: 'Generator Legitymacji',
    autoFill: 'Automatyczne (AI)',
    vertical: 'Pionowy',
    horizontal: 'Poziomy',
    schoolName: 'Nazwa Uczelni',
    studentName: 'Imię i Nazwisko',
    studentId: 'Numer Albumu',
    major: 'Kierunek / Wydział',
    issueDate: 'Data Wydania',
    expiryDate: 'Ważna do',
    photo: 'Zdjęcie',
    selectFile: 'Wybierz Plik',
    generate: 'Generuj Portret AI',
    noFileSelected: 'Nie wybrano pliku',
    logo: 'Godło / Logo',
    clear: 'Wyczyść',
    themeColor: 'Kolor Motywu',
    address: 'Adres',
    notes: 'Uwagi',
    downloadFront: 'Pobierz Przód',
    downloadBack: 'Pobierz Tył',
    generating: 'Generowanie...',
    showChip: 'Pokaż Czip (Chip)',
    cardholder: 'Student / Posiadacz Karty',
    authorizedSignature: 'Podpis Posiadacza',
    emergencyContact: 'Kontakt Alarmowy',
    propertyOf: 'Karta jest własnością',
    instructions: 'Należy ją nosić przy sobie i okazywać na żądanie władz uczelni. W przypadku znalezienia prosimy o zwrot na powyższy adres.',
    notTransferable: 'Karta niezbywalna.',
    emergencyNumberLabel: 'Numer Alarmowy',
  },
};