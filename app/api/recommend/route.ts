import {z} from 'zod';
import {askAI,errorResponse,guard,readBody} from '@/lib/ai';
export const runtime='nodejs';
const schema=z.object({remaining:z.object({kcal:z.number().min(0).max(10000),protein:z.number().min(0).max(1000),fat:z.number().min(0).max(1000),carbs:z.number().min(0).max(2000)})});
export async function POST(req:Request) {try {const body=schema.parse(await readBody(req));guard(req);return Response.json(await askAI(`Предложи ОДНО простое блюдо из 2–5 обычных продуктов. Остаток на день: ${JSON.stringify(body.remaining)}. Блюдо должно содержать не более ${Math.min(650,body.remaining.kcal)} ккал; это один приём пищи, не вся оставшаяся еда дня. Подбери порции с учётом оставшихся БЖУ. title=название блюда, note=короткая инструкция приготовления, items=его ингредиенты с порциями и КБЖУ на 100 г. Если калорий осталось меньше 80, верни items=[] и note=дневная цель достигнута.`));}catch(e){return errorResponse(e);}}
