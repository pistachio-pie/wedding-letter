export interface Invitation {
  id?: number
  userId: number
  groom_name: string
  groom_phone: string
  groom_father_name: string
  groom_mother_name: string
  bride_name: string
  bride_phone: string
  bride_father_name: string
  bride_mother_name: string
  wedding_date: string
  venue_name: string
  venue_address: string
  venue_contact: string
  transportation_info: string
  invitation_url: string
  invitation_message: string
  createdAt?: string
  updatedAt?: string
}

export interface Account {
  id?: number
  invitationId?: number
  owner_type: string
  bank_name: string
  account_number?: string
  account_holder?: string
  createdAt?: string
  updatedAt?: string
}

export interface Gallery {
  id?: number
  invitationId?: number
  image_url: string
  description?: string
  category?: string
  location?: string
  photoDate?: string
  createdAt?: string
  updatedAt?: string
}

// 초대장 조회 시, 반환되는 객체 -> 배열 response
export interface InvitationObject {
  invitation: Invitation
  accounts?: Account[]
  galleryImages?: Gallery[]
}

// 조회 요청 parameter 타입
export interface InvitationParams {
  userId?: number
  page?: number
  limit?: number
}
