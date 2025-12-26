import { apiClient } from '../../../shared/api/client';
import type {
  MilitaryRegistrationData,
  ResidencePlaceData,
  EducationData,
  VacationData,
  AbroadStayData,
  FamilyData,
  EmploymentData,
  LanguageData,
  OfficialRankData,
  MedicalExaminationData,
  AwardData,
  TrainingData,
} from '../model/employeeInfoTypes';

/**
 * Получить информацию о сотруднике
 */
export const fetchEmployeeInfo = async () => {
  const { data } = await apiClient.get('/api/employees/employee-info/');
  return data;
};

/**
 * Обновить воинский учет
 */
export const updateMilitaryRegistration = async (data: MilitaryRegistrationData) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    military_registration: data,
  });
  return response;
};

/**
 * Обновить место жительства
 */
export const updateResidencePlace = async (data: ResidencePlaceData) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    residence_place: data,
  });
  return response;
};

/**
 * Обновить образование
 */
export const updateEducation = async (data: EducationData[]) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    education: data,
  });
  return response;
};

/**
 * Обновить отпуска
 */
export const updateVacations = async (data: VacationData[]) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    vacations: data,
  });
  return response;
};

/**
 * Обновить прибывание за границей
 */
export const updateAbroadStays = async (data: AbroadStayData[]) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    abroad_stays: data,
  });
  return response;
};

/**
 * Обновить семейное положение
 */
export const updateFamily = async (data: FamilyData) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    family: data,
  });
  return response;
};

/**
 * Обновить трудовую деятельность
 */
export const updateEmployment = async (data: EmploymentData) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    employment: data,
  });
  return response;
};

/**
 * Обновить языки
 */
export const updateLanguages = async (data: LanguageData[]) => {
  const { data: response } = await apiClient.patch('/api/employees/employee-info/', {
    languages: data,
  });
  return response;
};

/**
 * Добавить дипломатический ранг
 */
export const createOfficialRank = async (data: OfficialRankData) => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('rank', data.rank);
  if (data.assigned) {
    formData.append('assigned', data.assigned);
  }
  if (data.certification) {
    const fileName = data.certification.split('/').pop() || 'certification.pdf';
    formData.append('certification', {
      uri: data.certification,
      type: 'application/pdf',
      name: fileName,
    } as any);
  }

  const { data: response } = await apiClient.post('/api/employees/official-ranks/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Добавить медицинский осмотр
 */
export const createMedicalExamination = async (data: MedicalExaminationData) => {
  const formData = new FormData();
  
  formData.append('birth_place', data.birth_place);
  if (data.passed) {
    formData.append('passed', data.passed);
  }
  if (data.certification) {
    const fileName = data.certification.split('/').pop() || 'certification.pdf';
    formData.append('certification', {
      uri: data.certification,
      type: 'application/pdf',
      name: fileName,
    } as any);
  }

  const { data: response } = await apiClient.post('/api/employees/medical-examinations/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Добавить награду
 */
export const createAward = async (data: AwardData) => {
  const formData = new FormData();
  
  formData.append('kind', data.kind);
  formData.append('award', data.award);
  if (data.received) {
    formData.append('received', data.received);
  }
  if (data.certification) {
    const fileName = data.certification.split('/').pop() || 'certification.pdf';
    formData.append('certification', {
      uri: data.certification,
      type: 'application/pdf',
      name: fileName,
    } as any);
  }

  const { data: response } = await apiClient.post('/api/employees/awards/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Добавить повышение квалификации
 */
export const createTraining = async (data: TrainingData) => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('kind', data.kind);
  if (data.started) {
    formData.append('started', data.started);
  }
  if (data.ended) {
    formData.append('ended', data.ended);
  }
  if (data.certification_type) {
    formData.append('certification_type', data.certification_type);
  }
  if (data.certification) {
    const fileName = data.certification.split('/').pop() || 'certification.pdf';
    formData.append('certification', {
      uri: data.certification,
      type: 'application/pdf',
      name: fileName,
    } as any);
  }

  const { data: response } = await apiClient.post('/api/employees/trainings/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

