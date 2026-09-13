const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 const origin=new URL(request.url).origin;if(request.headers.get('Origin')!==origin)return json({error:'Please submit the form from this website.'},403);
 if(!env.RESEND_API_KEY||!env.ENQUIRY_TO_EMAIL||!env.ENQUIRY_FROM_EMAIL||!env.TURNSTILE_SECRET_KEY)return json({error:'Online enquiries are not available yet. Please try again later.'},503);
 try{
 if(Number(request.headers.get('Content-Length')||0)>12000)return json({error:'Your enquiry is too long.'},413);
 const raw=await request.text();if(raw.length>12000)return json({error:'Your enquiry is too long.'},413);const d=JSON.parse(raw);
 if(d.website)return json({ok:true});
 const name=String(d.name||'').trim(),email=String(d.email||'').trim(),phone=String(d.phone||'').trim(),message=String(d.message||'').trim();
 if(!name||name.length>100||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||phone.length>40||message.length<10||message.length>3000||!['11–13','14–16','Other / SATs enquiry'].includes(d.age)||d.consent!=='on')return json({error:'Please check the required fields and privacy agreement.'},400);
 const token=String(d['cf-turnstile-response']||'');if(!token||token.length>2048)return json({error:'Please complete the security check.'},400);
 const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get('CF-Connecting-IP')||''}),signal:AbortSignal.timeout(10000)});const checked=await verification.json();if(!checked.success||checked.hostname!==new URL(request.url).hostname)return json({error:'Please complete the security check again.'},400);
 const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.ENQUIRY_FROM_EMAIL,to:[env.ENQUIRY_TO_EMAIL],reply_to:email,subject:'New tutoring enquiry',text:`Parent/carer: ${name}\nEmail: ${email}\nPhone: ${phone||'Not provided'}\nAge range: ${d.age}\n\n${message}\n\nAgreed to enquiry contact and read privacy information.`}),signal:AbortSignal.timeout(10000)});
 if(!sent.ok)return json({error:'We could not send your enquiry. Please try again later.'},502);return json({ok:true});
 }catch{return json({error:'Your enquiry could not be sent. Please try again.'},400)}
}
