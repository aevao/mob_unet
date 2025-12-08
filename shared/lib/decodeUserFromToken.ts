import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  user_data?: RawUserData;
}

interface RawUserData {
  id: number;
  user: number;
  first_name?: string;
  surname?: string;
  last_name?: string;
  number_phone?: string;
  email?: string | null;
  imeag?: string | null;
  gender?: string | null;
  data_of_birth?: string | null;
  user_type?: string | null;
  alert_number?: number;
}

export interface DecodedUser {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  surname: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  birthDate: string | null;
  userType: string | null;
  alertNumber: number;
  raw: RawUserData;
}

export const decodeUserFromToken = (token?: string | null): DecodedUser | null => {
  if (!token) return null;

  try {
    const payload = jwtDecode<TokenPayload>(token);
    const data = payload.user_data;

    if (!data) {
      return null;
    }

    const fullName = [data.surname, data.first_name, data.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      id: data.id?.toString() ?? '',
      name: fullName || '—',
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      surname: data.surname ?? null,
      email: data.email ?? null,
      phone: data.number_phone ?? null,
      avatarUrl: data.imeag ?? null,
      gender: data.gender ?? null,
      birthDate: data.data_of_birth ?? null,
      userType: data.user_type ?? null,
      alertNumber: data.alert_number ?? 0,
      raw: data,
    };
  } catch (error) {
    console.warn('Failed to decode token', error);
    return null;
  }
};


