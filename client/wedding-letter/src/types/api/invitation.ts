// 초대장 목록 요청 시 반환 형태
export interface InvitationInList {
  id: number
  userId: number
  groom_name: string
  bride_name: string
  wedding_date: string
  venue_name: string
  invitation_url: string
  createdAt?: string
  updatedAt?: string
}

// 초대장 상세 조회 시 반환 형태
export interface InvitationObject {
  id: number
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
  createdAt: string
  updatedAt: string
}

// 계좌 정보 오브젝트
export interface AccountObject {
  id: number
  invitationId: number
  owner_type: string
  bank_name: string
  createdAt: string
  updatedAt: string
}

// 갤러리 이미지 오브젝트
export interface GalleryObject {
  id: number
  invitationId: number
  image_url: string
  description: string
  createdAt: string
  updatedAt: string
}

// 초대장 상세 정보 반환 타입
export interface InvitationDetail {
  invitation: InvitationObject
  accounts?: AccountObject[]
  galleryImages?: GalleryObject[]
}

// 초대장 생성 시 요청 타입
export interface InvitationRequest {
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
  id?: number
}

export interface AccountRequest {
  owner_type: string
  bank_name: string
  account_number: string
  account_holder: string
}

export interface GalleryRequest {
  image_url: string
  description?: string
  category?: string
  location?: string
  photoDate?: string
  invitationId?: number
}

export interface InvitationDetailRequest {
  invitation: InvitationRequest
  accounts?: AccountRequest[]
  galleryImages?: GalleryRequest[]
}
