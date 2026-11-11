// 🧼 Texto seguro para meter en HTML. Todo lo que no escribimos nosotros (el nombre del perfil, lo que escribe
// el niño y, cuando haya cuentas, lo que llegue del servidor) pasa por aquí antes de ir a innerHTML o a un atributo.
const ENTIDADES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapa & < > " ' para que el texto se vea tal cual y nunca se lea como HTML. null o undefined → "". */
export const escapar = t => String(t ?? "").replace(/[&<>"']/g, c => ENTIDADES[c]);
