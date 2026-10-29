import { z } from 'zod';
export const profileSchema = z.object({
  name:z.string().trim().min(1).max(40), sex:z.enum(['female','male']), age:z.number().min(18).max(100), height:z.number().min(120).max(230), weight:z.number().min(35).max(250), body:z.enum(['slim','average','broad']), activity:z.enum(['1.2','1.375','1.55','1.725']), goal:z.enum(['lose','maintain','gain','recomp'])
});
export type Profile=z.infer<typeof profileSchema>;
export type Macros={kcal:number; protein:number; fat:number; carbs:number};
export const foodSchema=z.object({name:z.string().min(1).max(100),grams:z.number().positive().max(3000),kcal:z.number().min(0).max(1000),protein:z.number().min(0).max(100),fat:z.number().min(0).max(100),carbs:z.number().min(0).max(100)});
export type Food=z.infer<typeof foodSchema>;
export const mealSchema=z.object({title:z.string().min(1).max(100),note:z.string().max(400),items:z.array(foodSchema).max(10)});
export type Meal=z.infer<typeof mealSchema>;
export const entrySchema=z.object({id:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),time:z.string(),type:z.string(),title:z.string(),items:z.array(foodSchema).min(1).max(10)});
export type Entry=z.infer<typeof entrySchema>;
export const empty:Macros={kcal:0,protein:0,fat:0,carbs:0};
export function localDate(d=new Date()) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function targets(p:Profile):Macros {
  const basal=10*p.weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161);
  const factor={lose:.85,maintain:1,gain:1.10,recomp:.95}[p.goal];
  const kcal=Math.round(Math.max(p.sex==='male'?1500:1200,basal*Number(p.activity)*factor)/10)*10;
  const protein=Math.round(p.weight*(p.goal==='gain'||p.goal==='recomp'?1.8:1.6));
  const fat=Math.round(kcal*.28/9);
  return {kcal,protein,fat,carbs:Math.max(0,Math.round((kcal-protein*4-fat*9)/4))};
}
export function sumFoods(items:Food[]):Macros { return items.reduce((sum,f)=>({kcal:sum.kcal+f.kcal*f.grams/100,protein:sum.protein+f.protein*f.grams/100,fat:sum.fat+f.fat*f.grams/100,carbs:sum.carbs+f.carbs*f.grams/100}),{...empty}); }
export const goalNames={lose:'Снижение веса',maintain:'Поддержание веса',gain:'Набор массы',recomp:'Рекомпозиция'};
