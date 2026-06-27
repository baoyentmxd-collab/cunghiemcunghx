/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female';
  generation: number;
  birthYear: string;
  deathYear?: string;
  isDeceased: boolean;
  spouseId?: string;
  parentId?: string;
  childrenIds: string[];
  title: string;
  birthPlace?: string;
  restingPlace?: string;
  bio?: string;
}

export interface TributeMessage {
  id: string;
  memberName: string;
  relation: string;
  message: string;
  timestamp: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface TimelineEvent {
  year: number;
  member: FamilyMember;
  type: 'birth' | 'death';
  text: string;
}
