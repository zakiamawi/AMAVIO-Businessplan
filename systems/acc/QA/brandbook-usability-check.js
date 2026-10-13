const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'usability/styles.css'),'utf8').toLowerCase();
const html=fs.readFileSync(path.join(root,'usability/index.html'),'utf8');
const failures=[];
const required={
  'Brand Navy':'#0b1f3a','Stage Navy':'#081527','App Navy':'#10253d','Cream':'#f7f4ec','Ink':'#222222','Gold':'#c6a35a','Bronze':'#7d6130',
  'Confirmed Text':'#234c78','Confirmed Soft':'#e8eef5','Attention Text':'#a94f45','Attention Soft':'#fff0ed',
};
for (const [label,value] of Object.entries(required)) if(!css.includes(value)) failures.push(`${label} ${value} fehlt`);
for (const [pattern,label] of [
  [/#092928|#0b2524|#dfeee7|#235847|#edf3ef/i,'alte Teal-/Mintpalette'],
  [/manrope/i,'nicht freigegebene Manrope-Typografie'],
  [/linear-gradient|radial-gradient/i,'Tech-/Dekogradient'],
  [/border-radius:\s*(?:1[0-9]|[2-9][0-9])px/i,'Radius über 8 px'],
  [/box-shadow:\s*(?!none)/i,'Schatten außerhalb eines echten Overlays'],
]) if(pattern.test(css)) failures.push(`${label} gefunden`);
if(!css.includes('--font-sans:"geist"')) failures.push('Geist nicht als primäre UI-Schrift gesetzt');
if(!css.includes('--font-serif:"fraunces"')) failures.push('Fraunces nicht als redaktionelle Titelschrift gesetzt');
if(!css.includes('.brand img { display:block; width:180px')) failures.push('Logo-Mindestbreite 180 px nicht gesetzt');
if(!html.includes('../assets/brand/amavio-logo-light.svg')) failures.push('bestehendes Light-Logo nicht verwendet');
if(!html.includes('Produktiv noch nicht vorhanden')) failures.push('Reifegradstatus fehlt');
if(failures.length){ console.error('AMAVIO Brandbook Compliance – FEHLER'); failures.forEach((item)=>console.error(`- ${item}`)); process.exit(1); }
console.log(`AMAVIO Brandbook Compliance – OK (${Object.keys(required).length} verbindliche Farbrollen, Geist/Fraunces, 180-px-Logo, Radien 0/4/8, keine Teal-/Mintpalette, keine Gradienten und keine Panel-Schatten)`);
