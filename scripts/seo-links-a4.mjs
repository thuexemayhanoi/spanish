// Approved A4: exactly 10 editorial contextual links on five published articles.
// Source article JSON content is unchanged. A deterministic shared build insert keeps links across rebuilds.
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function addApprovedContextualLinks(html,url,actions){
 if(!Array.isArray(actions))throw Error('A4 matrix missing');
 let output=html;
 for(const task of actions.filter(item=>item.from===url)){
  if(task.action!=='ADD LINK'||task.status!=='IMPLEMENTED_VERIFIED')throw Error('A4 unauthorized task '+task.id);
  const marker='<section><h2>'+esc(task.section_h2)+'</h2>';
  if(output.split(marker).length!==2)throw Error('A4 missing/duplicate H2: '+task.id+' '+url);
  if(output.includes('data-a4-link="'+task.id+'"'))throw Error('A4 duplicated link: '+task.id);
  const snippet='<p class="contextual-reference" data-a4-link="'+esc(task.id)+
   '">Para ampliar este punto, consulta <a href="'+esc(task.to)+'">'+esc(task.anchor_proposal)+'</a>.</p>';
  output=output.replace(marker,marker+snippet);
 }
 return output;
}
