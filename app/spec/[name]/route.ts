import { specResponse } from '@/lib/docs/specResponse';
import inventory from '../../../content/docs/inventory.json';
export function generateStaticParams(){return inventory.specifications.map(name=>({name}));}
export async function GET(_request:Request,{params}:{params:Promise<{name:string}>}) {
 const {name}=await params;
 return specResponse(name,`attachment; filename="recoup-${name}"`);
}
