/**
 * Типы данных для информации о сотруднике
 */

export interface MilitaryRegistrationData {
  rank?: string;
  troop_kind?: string;
  is_fit?: boolean;
  draft_board?: string;
  composition?: string;
  specialty?: string;
}

export interface ResidencePlaceData {
  country?: string;
  region?: string;
  village?: string;
  city?: string;
  city_district?: string;
  region_district?: string;
  street?: string;
}

export interface EducationData {
  diploma_number?: string;
  level?: string;
  form?: string;
  institution?: string;
  department?: string;
  entered?: string; // YYYY-MM-DD
  graduated?: string; // YYYY-MM-DD
  disposed?: string;
  qualification?: string;
  academic_degree?: string;
  academic_rank?: string;
}

export interface VacationData {
  kind?: string;
  period?: string;
  started?: string; // YYYY-MM-DD
  ended?: string; // YYYY-MM-DD
  leave_order?: string;
  unused_days?: string;
  unpaid_days?: string;
  recall_order?: string;
  recall_order_date?: string; // YYYY-MM-DD
  leave_order_date?: string; // YYYY-MM-DD
  recalled?: string; // YYYY-MM-DD
}

export interface AbroadStayData {
  purpose?: string;
  country?: string;
  started?: string; // YYYY-MM-DD
  ended?: string; // YYYY-MM-DD
}

export interface RelativeData {
  name?: string;
  surname?: string;
  patronymic?: string;
  relationship?: string;
  born?: string; // YYYY-MM-DD
}

export interface FamilyData {
  marital_status?: string;
  relatives?: RelativeData[];
}

export interface ExperienceData {
  organization?: string;
  position?: string;
  started?: string; // YYYY-MM-DD
  ended?: string; // YYYY-MM-DD
  staff?: string | null;
  employment_order?: string;
  dismissal_order?: string;
}

export interface EmploymentData {
  total_experience?: string;
  professional_experience?: string;
  public_service_experience?: string;
  private_service_experience?: string;
  continuous_experience?: string;
  experiences?: ExperienceData[];
}

export interface LanguageData {
  is_mother_tongue?: boolean | string;
  language?: string;
  level?: string;
}

export interface OfficialRankData {
  title: string;
  rank: string;
  assigned?: string; // YYYY-MM-DD
  certification?: string; // URI файла
}

export interface MedicalExaminationData {
  birth_place: string;
  passed?: string; // YYYY-MM-DD
  certification?: string; // URI файла
}

export interface AwardData {
  kind: string;
  award: string;
  received?: string; // YYYY-MM-DD
  certification?: string; // URI файла
}

export interface TrainingData {
  title: string;
  kind: string;
  started?: string; // YYYY-MM-DD
  ended?: string; // YYYY-MM-DD
  certification_type?: string;
  certification?: string; // URI файла
}

