export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Pin: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Documents: undefined;
  DocumentDetail: { documentId: number };
  Applications: undefined;
  News: undefined;
  Certificates: undefined;
  CertificateDetail: { referenceId: number };
  Registration: undefined;
  PersonalCard: undefined;
  PersonalData: undefined;
  ScientificActivity: undefined;
  Tab: undefined;
  StudentTicket: undefined;
  EmployeeCard: undefined;
  Vedomost: undefined;
  ElectronicJournal: undefined;
  MilitaryRegistration: undefined;
  ResidencePlace: undefined;
  Education: undefined;
  Vacation: undefined;
  AbroadStay: undefined;
  Family: undefined;
  Employment: undefined;
  Language: undefined;
};

export type GradesStackParamList = {
  Grades: undefined;
};

export type ScheduleStackParamList = {
  Schedule: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type TasksStackParamList = {
  Tasks: undefined;
  TaskDetail: { taskId: number };
};


