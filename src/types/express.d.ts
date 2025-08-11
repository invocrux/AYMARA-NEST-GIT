// Extender la interfaz Request de Express para incluir requestId
declare namespace Express {
  export interface Request {
    requestId?: string;
  }
}