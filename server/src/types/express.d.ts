// Multer 타입 확장을 위한 타입 정의 파일
import 'express'

declare global {
    namespace Express {
        // Multer 네임스페이스 대신 인터페이스로 정의
        interface Request {
            file: Multer.File
            files: { [fieldname: string]: Multer.File[] } | Multer.File[]
        }
    }
}

// Multer 타입 정의
declare namespace Multer {
    interface File {
        /** 필드명 */
        fieldname: string
        /** 원본 파일명 */
        originalname: string
        /** MIME 타입 */
        mimetype: string
        /** 파일 크기 (바이트) */
        size: number
        /** 파일 버퍼 */
        buffer: Buffer
        /** 임시 저장 경로 (선택적) */
        path?: string
        /** 인코딩 */
        encoding?: string
        /** 목적지 (선택적) */
        destination?: string
        /** 저장된 파일명 (선택적) */
        filename?: string
    }
}
