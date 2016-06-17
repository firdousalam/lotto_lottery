(function(jsPDFAPI){'use strict';jsPDFAPI.addHTML=function(element,x,y,options,callback){'use strict';if(typeof html2canvas==='undefined'&&typeof rasterizeHTML==='undefined')
throw new Error('You need either '
+'https://github.com/niklasvh/html2canvas'
+' or https://github.com/cburgmer/rasterizeHTML.js');if(typeof x!=='number'){options=x;callback=y;}
if(typeof options==='function'){callback=options;options=null;}
var I=this.internal,K=I.scaleFactor,W=I.pageSize.width,H=I.pageSize.height;options=options||{};options.onrendered=function(obj){x=parseInt(x)||0;y=parseInt(y)||0;var dim=options.dim||{};var h=dim.h||0;var w=dim.w||Math.min(W,obj.width/K)-x;var format='JPEG';if(options.format)
format=options.format;if(obj.height>H&&options.pagesplit){var crop=function(){var cy=0;while(1){var canvas=document.createElement('canvas');canvas.width=Math.min(W*K,obj.width);canvas.height=Math.min(H*K,obj.height-cy);var ctx=canvas.getContext('2d');ctx.drawImage(obj,0,cy,obj.width,canvas.height,0,0,canvas.width,canvas.height);var args=[canvas,x,cy?0:y,canvas.width/K,canvas.height/K,format,null,'SLOW'];this.addImage.apply(this,args);cy+=canvas.height;if(cy>=obj.height)break;this.addPage();}
callback(w,cy,null,args);}.bind(this);if(obj.nodeName==='CANVAS'){var img=new Image();img.onload=crop;img.src=obj.toDataURL("image/png");obj=img;}else{crop();}}else{var alias=Math.random().toString(35);var args=[obj,x,y,w,h,format,alias,'SLOW'];this.addImage.apply(this,args);callback(w,h,alias,args);}}.bind(this);if(typeof html2canvas!=='undefined'&&!options.rstz){return html2canvas(element,options);}
if(typeof rasterizeHTML!=='undefined'){var meth='drawDocument';if(typeof element==='string'){meth=/^http/.test(element)?'drawURL':'drawHTML';}
options.width=options.width||(W*K);return rasterizeHTML[meth](element,void 0,options).then(function(r){options.onrendered(r.image);},function(e){callback(null,e);});}
return null;};})(jsPDF.API);