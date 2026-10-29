import {z} from 'zod';
import {askAI,errorResponse,guard,readBody} from '@/lib/ai';
export const runtime='nodejs';
const schema=z.object({text:z.string().trim().max(1000).default(''),image:z.string().max(1_500_000).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).optional()}).refine(v=>v.text.length>0||v.image);
export async function POST(req:Request) {try {const body=schema.parse(await readBody(req));guard(req);return Response.json(await askAI(`Оцени еду, продукты и порции. Если масса не указана, оцени обычную порцию и напиши об этом. Описание: ${body.text||'Порция на фотографии'}`,body.image));}catch(e){return errorResponse(e);}}
