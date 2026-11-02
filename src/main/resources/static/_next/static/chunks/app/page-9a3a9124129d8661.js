(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{5334:function(e,t,a){Promise.resolve().then(a.bind(a,5719))},5719:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return MainPage}});var React=a(2265),useState=React.useState,useEffect=React.useEffect,useMemo=React.useMemo,useCallback=React.useCallback,useRef=React.useRef,useRouter=a(9376).useRouter,create=a(3011).U,_zmw=a(6885),persist=_zmw.tJ,createJSONStorage=_zmw.FL,ReactMarkdown=a(1713).a,remarkGfm=a(1770).D,_rq=a(9827),useQuery=_rq.aM,useMutation=_rq.D,useQueryClient=_rq.NL,useAuthStore=a(3864).t,_api=a(1837),api=_api.h,ApiError=_api.ApiError,_u=a(3448),cn=_u.cn,formatBytes=_u.formatBytes,formatDate=_u.formatDate,getFileExtension=_u.getFileExtension,getParentDirectory=_u.getParentDirectory,getFileCategory=_u.getFileCategory,isPreviewable=_u.isPreviewable,isEditableText=_u.isEditableText,getPreviewKind=_u.getPreviewKind,getDownloadUrl=_u.getDownloadUrl,getZipDownloadUrl=_u.getZipDownloadUrl,getPreviewUrl=_u.getPreviewUrl,copyToClipboard=_u.copyToClipboard,THEME_OPTIONS=_u.THEME_OPTIONS,getSavedTheme=_u.getSavedTheme,applyThemeToDom=_u.applyThemeToDom,detectBrowserLocale=_u.detectBrowserLocale,getSavedLocale=_u.getSavedLocale,isLocaleFollowingBrowser=_u.isLocaleFollowingBrowser,applyLocaleToDom=_u.applyLocaleToDom,tr=_u.tr,localizeServerMessage=_u.localizeServerMessage,Button=a(2381).z,Input=a(279).I,_dm=a(1418),DropdownMenuPrimitive={Root:_dm.fC,Trigger:_dm.xz,Group:_dm.ZA,Portal:_dm.Uv,Sub:_dm.Tr,RadioGroup:_dm.Ee,SubTrigger:_dm.fF,SubContent:_dm.tu,Content:_dm.VY,Item:_dm.ck,CheckboxItem:_dm.oC,RadioItem:_dm.Rk,Label:_dm.Z8,Separator:_dm.Z0},_dlg=a(9027),DialogPrimitive={Root:_dlg.fC,Trigger:_dlg.xz,Portal:_dlg.h_,Close:_dlg.x8,Overlay:_dlg.aV,Content:_dlg.VY,Title:_dlg.Dx,Description:_dlg.dk},_prog=a(610),ProgressPrimitive={Root:_prog.fC,Indicator:_prog.z$},_sw=a(721),SwitchPrimitives={Root:_sw.fC,Thumb:_sw.bU},_lucide=a(9205);
const Globe=(0,_lucide.Z)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o17"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);
const Palette=(0,_lucide.Z)("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"45f9"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"121g"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"123f"}]]);
const Ticket=(0,_lucide.Z)("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"134"}],["path",{d:"M13 5v2",key:"1"}],["path",{d:"M13 17v2",key:"2"}],["path",{d:"M13 11v2",key:"3"}]]);
const AlertCircle=(0,_lucide.Z)("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);
const AlertTriangle=(0,_lucide.Z)("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);
const AlertOctagon=(0,_lucide.Z)("AlertOctagon",[["polygon",{points:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",key:"h34r1"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);
const ArrowDown=(0,_lucide.Z)("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);
const ArrowRight=(0,_lucide.Z)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);
const ArrowUp=(0,_lucide.Z)("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);
const ArrowUpDown=(0,_lucide.Z)("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);
const BookOpen=(0,_lucide.Z)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);
const Calendar=(0,_lucide.Z)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);
const Check=(0,_lucide.Z)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);
const CheckCheck=(0,_lucide.Z)("CheckCheck",[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]]);
const CheckCircle2=(0,_lucide.Z)("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);
const CheckSquare=(0,_lucide.Z)("CheckSquare",[["polyline",{points:"9 11 12 14 22 4",key:"1K3w9a"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);
const ChevronDown=(0,_lucide.Z)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);
const ChevronLeft=(0,_lucide.Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);
const ChevronRight=(0,_lucide.Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);
const ChevronUp=(0,_lucide.Z)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);
const Circle=(0,_lucide.Z)("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);
const Clock=(0,_lucide.Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);
const CloudUpload=(0,_lucide.Z)("CloudUpload",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m16 16-4-4-4 4",key:"119cdb"}]]);
const Code=(0,_lucide.Z)("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);
const Columns=(0,_lucide.Z)("Columns",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 3v18",key:"108xh3"}]]);
const Copy=(0,_lucide.Z)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);
const Database=(0,_lucide.Z)("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);
const Download=(0,_lucide.Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);
const Edit2=(0,_lucide.Z)("Edit2",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);
const Edit3=(0,_lucide.Z)("Edit3",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"13n1m3"}]]);
const ExternalLink=(0,_lucide.Z)("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);
const Eye=(0,_lucide.Z)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);
const FileArchive=(0,_lucide.Z)("FileArchive",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M10 13H8",key:"142P08"}],["path",{d:"M10 17H8",key:"1n5v10"}]]);
const FileAudio=(0,_lucide.Z)("FileAudio",[["path",{d:"M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"12329p"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0",key:"1et2d5"}]]);
const FileCode=(0,_lucide.Z)("FileCode",[["path",{d:"M10 12.5 8 15l2 2.5",key:"1tg20x"}],["path",{d:"m14 12.5 2 2.5-2 2.5",key:"1bir2l"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx3k"}]]);
const FileImage=(0,_lucide.Z)("FileImage",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["circle",{cx:"10",cy:"12",r:"2",key:"17b9bb"}],["path",{d:"m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",key:"12w7p7"}]]);
const FilePlus2=(0,_lucide.Z)("FilePlus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M3 15h6",key:"4232k"}],["path",{d:"M6 12v6",key:"15v8r6"}]]);
const FileText=(0,_lucide.Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);
const FileVideo=(0,_lucide.Z)("FileVideo",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m10 11 5 3-5 3v-6Z",key:"1ntvm4"}]]);
const Folder=(0,_lucide.Z)("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);
const FolderInput=(0,_lucide.Z)("FolderInput",[["path",{d:"M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",key:"14dc1k"}],["path",{d:"M2 13h10",key:"12fb38"}],["path",{d:"m9 16 3-3-3-3",key:"1d2p4n"}]]);
const FolderOpen=(0,_lucide.Z)("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"12r28w"}]]);
const FolderPlus=(0,_lucide.Z)("FolderPlus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1u5f0p"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);
const Github=(0,_lucide.Z)("Github",[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]]);
const HardDrive=(0,_lucide.Z)("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);
const Heart=(0,_lucide.Z)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c30ky"}]]);
const Home=(0,_lucide.Z)("Home",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);
const Info=(0,_lucide.Z)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);
const KeyRound=(0,_lucide.Z)("KeyRound",[["path",{d:"M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z",key:"1fxcex"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);
const LayoutGrid=(0,_lucide.Z)("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"1v5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);
const Lightbulb=(0,_lucide.Z)("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);
const List=(0,_lucide.Z)("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1p63bc"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);
const ListTree=(0,_lucide.Z)("ListTree",[["path",{d:"M21 12h-8",key:"1bmf0i"}],["path",{d:"M21 6H8",key:"1pqb7v"}],["path",{d:"M21 18h-8",key:"1c4r2k"}],["path",{d:"M3 6v4c0 1.1.9 2 2 2h3",key:"1y83k1"}],["path",{d:"M3 10v6c0 1.1.9 2 2 2h3",key:"1v493a"}]]);
const Lock=(0,_lucide.Z)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);
const LogOut=(0,_lucide.Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);
const Maximize2=(0,_lucide.Z)("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"17b57r"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1intq8"}]]);
const Menu=(0,_lucide.Z)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);
const Minimize2=(0,_lucide.Z)("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"97r2m"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1intq8"}]]);
const MoreHorizontal=(0,_lucide.Z)("MoreHorizontal",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);
const MoreVertical=(0,_lucide.Z)("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);
const Pause=(0,_lucide.Z)("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);
const Play=(0,_lucide.Z)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);
const RefreshCw=(0,_lucide.Z)("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);
const RotateCw=(0,_lucide.Z)("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);
const Save=(0,_lucide.Z)("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);
const Search=(0,_lucide.Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);
const Server=(0,_lucide.Z)("Server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]);
const Settings=(0,_lucide.Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);
const Share2=(0,_lucide.Z)("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);
const ShieldAlert=(0,_lucide.Z)("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);
const ShieldCheck=(0,_lucide.Z)("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);
const Sliders=(0,_lucide.Z)("Sliders",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1s142t"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"1i929v"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf22a"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1j0mnr"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"12d42w"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"1c12rk"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1j59d8"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1fa5r6"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1dc27r"}]]);
const Sparkles=(0,_lucide.Z)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4124o"}]]);
const Star=(0,_lucide.Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"126Qv8"}]]);
const Trash2=(0,_lucide.Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"limitq"}]]);
const Upload=(0,_lucide.Z)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);
const UploadCloud=(0,_lucide.Z)("UploadCloud",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M12 12v9",key:"192myk"}],["path",{d:"m16 16-4-4-4 4",key:"119cdb"}]]);
const User=(0,_lucide.Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);
const UserPlus=(0,_lucide.Z)("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1Lc7a"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvy3"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"13g4k"}]]);
const Users=(0,_lucide.Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1Lc7a"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshe6"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);
const WrapText=(0,_lucide.Z)("WrapText",[["line",{x1:"3",x2:"21",y1:"6",y2:"6",key:"4m8b9"}],["path",{d:"M3 12h15a3 3 0 1 1 0 6h-4",key:"1cl27"}],["polyline",{points:"16 16 14 18 16 20",key:"12v2r"}],["line",{x1:"3",x2:"10",y1:"18",y2:"18",key:"12k3p"}]]);
const X=(0,_lucide.Z)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);
const ZoomIn=(0,_lucide.Z)("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);
const ZoomOut=(0,_lucide.Z)("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuSubTrigger = React.forwardRef(({
  className,
  inset,
  children,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DropdownMenuPrimitive.SubTrigger, _extends({
  ref: ref,
  className: cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pl-8", className)
}, props), children, /*#__PURE__*/React.createElement(ChevronRight, {
  className: "ml-auto h-4 w-4"
})));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DropdownMenuPrimitive.SubContent, _extends({
  ref: ref,
  className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)
}, props)));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({
  className,
  sideOffset = 4,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DropdownMenuPrimitive.Portal, null, /*#__PURE__*/React.createElement(DropdownMenuPrimitive.Content, _extends({
  ref: ref,
  sideOffset: sideOffset,
  className: cn("z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)
}, props))));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({
  className,
  inset,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DropdownMenuPrimitive.Item, _extends({
  ref: ref,
  className: cn("relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors focus:bg-secondary/15 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className)
}, props)));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuSeparator = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DropdownMenuPrimitive.Separator, _extends({
  ref: ref,
  className: cn("-mx-1 my-1 h-px bg-muted", className)
}, props)));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DialogPrimitive.Overlay, _extends({
  ref: ref,
  className: cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)
}, props)));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DialogPortal, null, /*#__PURE__*/React.createElement(DialogOverlay, null), /*#__PURE__*/React.createElement(DialogPrimitive.Content, _extends({
  ref: ref,
  className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl", className)
}, props), children, /*#__PURE__*/React.createElement(DialogPrimitive.Close, {
  className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
}, /*#__PURE__*/React.createElement(X, {
  className: "h-4 w-4"
}), /*#__PURE__*/React.createElement("span", {
  className: "sr-only"
}, "Close")))));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className)
}, props));
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)
}, props));
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DialogPrimitive.Title, _extends({
  ref: ref,
  className: cn("text-lg font-semibold leading-none tracking-tight text-brand-primary", className)
}, props)));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(DialogPrimitive.Description, _extends({
  ref: ref,
  className: cn("text-sm text-muted-foreground", className)
}, props)));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Progress = React.forwardRef(({
  className,
  value,
  indicatorColor,
  ...props
}, ref) => /*#__PURE__*/React.createElement(ProgressPrimitive.Root, _extends({
  ref: ref,
  className: cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary/20", className)
}, props), /*#__PURE__*/React.createElement(ProgressPrimitive.Indicator, {
  className: cn("h-full w-full flex-1 transition-all", indicatorColor || "bg-primary"),
  style: {
    transform: `translateX(-${100 - (value || 0)}%)`
  }
})));
Progress.displayName = ProgressPrimitive.Root.displayName;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Switch = React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement(SwitchPrimitives.Root, _extends({
  className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className)
}, props, {
  ref: ref
}), /*#__PURE__*/React.createElement(SwitchPrimitives.Thumb, {
  className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")
})));
Switch.displayName = SwitchPrimitives.Root.displayName;
const useFileStore = create((set, get) => ({
  currentPath: "",
  viewMode: "files",
  layout: "grid",
  theme: "classic",
  locale: typeof window !== "undefined" ? getSavedLocale() : "zh",
  localeAuto: typeof window !== "undefined" ? isLocaleFollowingBrowser() : true,
  sortBy: "name",
  sortOrder: "asc",
  searchQuery: "",
  selectedFile: null,
  selectedPaths: [],
  previewFile: null,
  previewAutoEdit: false,
  uploadConflict: null,
  shareModalFile: null,
  activeShareToken: null,
  activeShareServerUrl: "",
  activeSharePassword: "",
  moveModalFile: null,
  batchMovePaths: null,
  moveModalMode: "move",
  renameModalFile: null,
  newFolderModalOpen: false,
  newFileModalOpen: false,
  passwordModalOpen: false,
  sidebarOpen: false,
  toasts: [],
  confirmDialog: null,
  setCurrentPath: path => {
    set({
      currentPath: path,
      selectedFile: null,
      selectedPaths: []
    });
    if (get().viewMode === "files") {
      syncHash("files", path);
    }
  },
  setViewMode: mode => {
    set({
      viewMode: mode,
      selectedFile: null,
      selectedPaths: []
    });
    syncHash(mode, mode === "files" ? get().currentPath : "");
  },
  setLayout: layout => set({
    layout
  }),
  setTheme: theme => {
    applyThemeToDom(theme);
    set({
      theme
    });
  },
  setLocale: target => {
    if (target === "auto") {
      const detected = detectBrowserLocale();
      applyLocaleToDom(detected, "auto");
      set({
        locale: detected,
        localeAuto: true
      });
    } else {
      applyLocaleToDom(target, true);
      set({
        locale: target,
        localeAuto: false
      });
    }
  },
  syncLocaleFromBrowser: () => {
    const active = getSavedLocale();
    const isAuto = isLocaleFollowingBrowser();
    applyLocaleToDom(active);
    set({
      locale: active,
      localeAuto: isAuto
    });
  },
  setSort: field => {
    const {
      sortBy,
      sortOrder
    } = get();
    if (sortBy === field) {
      set({
        sortOrder: sortOrder === "asc" ? "desc" : "asc"
      });
    } else {
      set({
        sortBy: field,
        sortOrder: field === "name" ? "asc" : "desc"
      });
    }
  },
  setSearchQuery: query => set({
    searchQuery: query
  }),
  setSelectedFile: file => set({
    selectedFile: file
  }),
  toggleSelectPath: path => {
    const {
      selectedPaths
    } = get();
    if (selectedPaths.includes(path)) {
      set({
        selectedPaths: selectedPaths.filter(p => p !== path)
      });
    } else {
      set({
        selectedPaths: [...selectedPaths, path]
      });
    }
  },
  setSelectedPaths: paths => set({
    selectedPaths: paths
  }),
  clearSelection: () => set({
    selectedPaths: []
  }),
  setPreviewFile: file => set({
    previewFile: file,
    previewAutoEdit: false
  }),
  openEditor: file => set({
    previewFile: file,
    previewAutoEdit: true
  }),
  setUploadConflict: conflict => set({
    uploadConflict: conflict
  }),
  setShareModalFile: file => set({
    shareModalFile: file
  }),
  openSharedSpace: (token, remoteServerUrl = "", password = "") => {
    set({
      viewMode: "shares",
      activeShareToken: token,
      activeShareServerUrl: remoteServerUrl,
      activeSharePassword: password
    });
    if (typeof window !== "undefined" && !remoteServerUrl) {
      window.history.pushState(null, "", `#/s/${encodeURIComponent(token)}`);
    }
  },
  closeSharedSpace: () => {
    set({
      activeShareToken: null,
      activeShareServerUrl: "",
      activeSharePassword: ""
    });
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/s/")) {
      window.history.pushState(null, "", "#/shares");
    }
  },
  setMoveModalFile: file => set({
    moveModalFile: file,
    moveModalMode: "move"
  }),
  setBatchMovePaths: paths => set({
    batchMovePaths: paths,
    moveModalMode: "move"
  }),
  setMoveModalMode: mode => set({
    moveModalMode: mode
  }),
  openCopyModal: file => set({
    moveModalFile: file,
    moveModalMode: "copy"
  }),
  openBatchCopyModal: paths => set({
    batchMovePaths: paths,
    moveModalMode: "copy"
  }),
  setRenameModalFile: file => set({
    renameModalFile: file
  }),
  setNewFolderModalOpen: open => set({
    newFolderModalOpen: open
  }),
  setNewFileModalOpen: open => set({
    newFileModalOpen: open
  }),
  setPasswordModalOpen: open => set({
    passwordModalOpen: open
  }),
  setSidebarOpen: open => set({
    sidebarOpen: open
  }),
  toggleSidebar: () => set(state => ({
    sidebarOpen: !state.sidebarOpen
  })),
  navigateToFolder: target => {
    const {
      currentPath,
      viewMode
    } = get();
    let nextPath = target;
    if (viewMode === "files" && !target.includes("/")) {
      nextPath = currentPath ? `${currentPath}/${target}` : target;
    }
    set({
      currentPath: nextPath,
      viewMode: "files",
      selectedFile: null,
      selectedPaths: []
    });
    syncHash("files", nextPath);
  },
  openFolder: path => {
    set({
      currentPath: path,
      viewMode: "files",
      selectedFile: null,
      selectedPaths: []
    });
    syncHash("files", path);
  },
  openContainingFolder: item => {
    const parent = item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : "";
    set({
      currentPath: parent,
      viewMode: "files",
      selectedFile: item,
      selectedPaths: []
    });
    syncHash("files", parent);
  },
  navigateUp: () => {
    const {
      currentPath
    } = get();
    if (!currentPath) return;
    const parts = currentPath.split("/");
    parts.pop();
    const nextPath = parts.join("/");
    set({
      currentPath: nextPath,
      selectedFile: null,
      selectedPaths: [],
      viewMode: "files"
    });
    syncHash("files", nextPath);
  },
  showToast: (text, type = "info") => {
    const id = "t_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    const localized = localizeServerMessage(text, get().locale);
    set(s => ({
      toasts: [...s.toasts, {
        id,
        text: localized,
        type
      }]
    }));
    setTimeout(() => {
      set(s => ({
        toasts: s.toasts.filter(t => t.id !== id)
      }));
    }, 3200);
  },
  dismissToast: id => {
    set(s => ({
      toasts: s.toasts.filter(t => t.id !== id)
    }));
  },
  openConfirm: options => set({
    confirmDialog: options
  }),
  closeConfirm: () => set({
    confirmDialog: null
  })
}));
function useI18n() {
  const locale = useFileStore(s => s.locale);
  const localeAuto = useFileStore(s => s.localeAuto);
  const setLocale = useFileStore(s => s.setLocale);
  const isEn = locale === "en";
  const t = (zh, en) => isEn ? en : zh;
  return {
    locale,
    isEn,
    localeAuto,
    setLocale,
    t
  };
}
function viewModeToHash(mode, currentPath = "") {
  if (mode === "files") {
    if (!currentPath) return "#/";
    const encoded = currentPath.split("/").filter(Boolean).map(encodeURIComponent).join("/");
    return encoded ? `#/files/${encoded}` : "#/";
  }
  return `#/${mode}`;
}
function syncHash(mode, currentPath = "") {
  if (typeof window === "undefined") return;
  const target = viewModeToHash(mode, currentPath);
  if (window.location.hash !== target) {
    window.history.pushState(null, "", target);
  }
}
const CHUNK_SIZE = 5 * 1024 * 1024;
const CHUNK_THRESHOLD = 50 * 1024 * 1024;
const CONCURRENCY = 3;
const MAX_ACTIVE_TASKS = 2;
const fileMap = new Map();
const activeChunkControllers = new Map();
const activeSimpleControllers = new Map();
function generateFingerprint(file, directory) {
  return `${file.name}_${file.size}_${file.lastModified}_${directory || "root"}`;
}
const useUploadStore = create()(persist((set, get) => ({
  tasks: [],
  isDrawerOpen: true,
  concurrencyLimit: CONCURRENCY,
  toggleDrawer: () => set(state => ({
    isDrawerOpen: !state.isDrawerOpen
  })),
  setDrawerOpen: open => set({
    isDrawerOpen: open
  }),
  addFile: async (file, directory, conflictStrategy = "rename") => {
    const fingerprint = generateFingerprint(file, directory);
    const {
      tasks
    } = get();
    const existing = tasks.find(t => t.fingerprint === fingerprint && t.status !== "completed");
    if (existing) {
      fileMap.set(existing.id, file);
      const isActive = existing.status === "pending" || existing.status === "uploading" || existing.status === "initializing" || existing.status === "merging";
      if (isActive) {
        set(state => ({
          isDrawerOpen: true
        }));
        return existing.id;
      }
      set(state => ({
        isDrawerOpen: true,
        tasks: state.tasks.map(t => t.id === existing.id ? {
          ...t,
          status: "pending",
          errorMessage: undefined
        } : t)
      }));
      scheduleNextUploads(get, set);
      return existing.id;
    }
    const tempId = "task_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
    const newTask = {
      id: tempId,
      fingerprint,
      name: file.name,
      size: file.size,
      directory,
      conflictStrategy,
      chunkSize: CHUNK_SIZE,
      totalChunks,
      uploadedChunks: [],
      status: "pending",
      progress: 0,
      speed: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };
    fileMap.set(tempId, file);
    set(state => ({
      isDrawerOpen: true,
      tasks: [newTask, ...state.tasks]
    }));
    scheduleNextUploads(get, set);
    return tempId;
  },
  pauseTask: id => {
    const simpleCtrl = activeSimpleControllers.get(id);
    if (simpleCtrl) {
      simpleCtrl.abort();
      activeSimpleControllers.delete(id);
    }
    const chunkCtrls = activeChunkControllers.get(id);
    if (chunkCtrls) {
      chunkCtrls.forEach(ctrl => ctrl.abort());
      chunkCtrls.clear();
    }
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? {
        ...t,
        status: "paused",
        speed: 0
      } : t)
    }));
    scheduleNextUploads(get, set);
  },
  resumeTask: async id => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const file = fileMap.get(id);
    if (!file) {
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? {
          ...t,
          status: "interrupted",
          errorMessage: tr("刷新后文件句柄已失效，请重新选择文件继续", "File handle lost after reload, please re-select the file to resume")
        } : t)
      }));
      return;
    }
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? {
        ...t,
        status: "pending",
        errorMessage: undefined
      } : t)
    }));
    scheduleNextUploads(get, set);
  },
  rebindFileAndResume: async (id, file) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    if (file.name !== task.name || file.size !== task.size) {
      const errMsg = tr(`所选文件不匹配！期望: ${task.name} (${formatBytes(task.size)})，实际: ${file.name} (${formatBytes(file.size)})`, `Selected file mismatch! Expected: ${task.name} (${formatBytes(task.size)}), got: ${file.name} (${formatBytes(file.size)})`);
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? {
          ...t,
          errorMessage: errMsg
        } : t)
      }));
      throw new Error(errMsg);
    }
    fileMap.set(id, file);
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? {
        ...t,
        status: "pending",
        errorMessage: undefined
      } : t)
    }));
    scheduleNextUploads(get, set);
  },
  cancelTask: async id => {
    const simpleCtrl = activeSimpleControllers.get(id);
    if (simpleCtrl) {
      simpleCtrl.abort();
      activeSimpleControllers.delete(id);
    }
    const chunkCtrls = activeChunkControllers.get(id);
    if (chunkCtrls) {
      chunkCtrls.forEach(ctrl => ctrl.abort());
      chunkCtrls.clear();
    }
    activeChunkControllers.delete(id);
    fileMap.delete(id);
    try {
      if (!id.startsWith("task_")) {
        await api.cancelChunkedUpload(id);
      }
    } catch {}
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
    scheduleNextUploads(get, set);
  },
  retryTask: async id => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const file = fileMap.get(id);
    if (!file) {
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? {
          ...t,
          status: "interrupted",
          errorMessage: tr("请重新选择文件重试", "Please re-select the file to retry")
        } : t)
      }));
      return;
    }
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? {
        ...t,
        status: "pending",
        errorMessage: undefined
      } : t)
    }));
    scheduleNextUploads(get, set);
  },
  clearCompleted: () => {
    set(state => ({
      tasks: state.tasks.filter(t => t.status !== "completed" && t.status !== "error")
    }));
  },
  enqueueWithConflictCheck: async (entries, emptyDirs, targetDir) => {
    let existingItems = [];
    try {
      const res = await api.getFiles(targetDir);
      existingItems = res.items;
    } catch {}
    const existingFolders = new Set(existingItems.filter(i => i.isDirectory).map(i => i.name));
    const existingFiles = new Set(existingItems.filter(i => !i.isDirectory).map(i => i.name));
    const topFolders = new Set();
    const topFiles = new Set();
    for (const e of entries) {
      if (e.subPath) {
        const top = e.subPath.split("/")[0];
        if (top) topFolders.add(top);
      } else {
        topFiles.add(e.file.name);
      }
    }
    for (const d of emptyDirs) {
      const top = d.split("/")[0];
      if (top) topFolders.add(top);
    }
    const conflictingFolders = Array.from(topFolders).filter(f => existingFolders.has(f));
    const conflictingFiles = Array.from(topFiles).filter(f => existingFiles.has(f));
    if (conflictingFolders.length > 0 || conflictingFiles.length > 0) {
      useFileStore.getState().setUploadConflict({
        targetDir,
        entries,
        emptyDirs,
        conflictingFolders,
        conflictingFiles
      });
      return;
    }
    for (const emptySub of emptyDirs) {
      try {
        await api.createDirectory(targetDir, emptySub);
      } catch {}
    }
    for (const item of entries) {
      const dest = item.subPath ? targetDir ? `${targetDir}/${item.subPath}` : item.subPath : targetDir;
      await get().addFile(item.file, dest, "rename");
    }
  }
}), {
  name: "storeit-upload-tasks",
  storage: createJSONStorage(() => localStorage),
  onRehydrateStorage: () => state => {
    if (!state) return;
    state.tasks = state.tasks.map(t => {
      if (t.status === "uploading" || t.status === "initializing" || t.status === "pending" || t.status === "merging") {
        return {
          ...t,
          status: "interrupted",
          speed: 0,
          errorMessage: tr("页面刷新中断，请重新添加或绑定原文件继续断点续传", "Interrupted by page reload, please re-add or rebind the file to resume")
        };
      }
      return t;
    });
  },
  partialize: state => ({
    tasks: state.tasks.map(t => ({
      id: t.id,
      fingerprint: t.fingerprint,
      name: t.name,
      size: t.size,
      directory: t.directory,
      conflictStrategy: t.conflictStrategy,
      chunkSize: t.chunkSize,
      totalChunks: t.totalChunks,
      uploadedChunks: [],
      status: t.status === "completed" ? "completed" : "interrupted",
      progress: t.progress,
      speed: 0,
      errorMessage: t.errorMessage,
      createdAt: t.createdAt,
      lastUpdated: t.lastUpdated
    })),
    isDrawerOpen: state.isDrawerOpen
  })
}));
function scheduleNextUploads(get, set) {
  const {
    tasks
  } = get();
  const activeCount = tasks.filter(t => t.status === "uploading" || t.status === "initializing" || t.status === "merging").length;
  if (activeCount >= MAX_ACTIVE_TASKS) return;
  const nextTask = tasks.find(t => t.status === "pending");
  if (!nextTask) return;
  const file = fileMap.get(nextTask.id);
  if (!file) {
    set(state => ({
      tasks: state.tasks.map(t => t.id === nextTask.id ? {
        ...t,
        status: "interrupted",
        errorMessage: tr("文件句柄丢失，请重新选择文件", "File handle lost, please re-select the file")
      } : t)
    }));
    return;
  }
  if (file.size <= CHUNK_THRESHOLD) {
    executeSimpleUpload(nextTask.id, file, get, set);
  } else {
    executeChunkedUpload(nextTask.id, file, get, set);
  }
}
async function executeSimpleUpload(taskId, file, get, set) {
  const task = get().tasks.find(t => t.id === taskId);
  if (!task) return;
  const controller = new AbortController();
  activeSimpleControllers.set(taskId, controller);
  set(state => ({
    tasks: state.tasks.map(t => t.id === taskId ? {
      ...t,
      status: "uploading",
      speed: 0,
      errorMessage: undefined
    } : t)
  }));
  let lastBytes = 0;
  let lastTime = Date.now();
  try {
    await api.uploadSingleFile(file, task.directory, percent => {
      const now = Date.now();
      const currentBytes = percent / 100 * file.size;
      const timeDelta = (now - lastTime) / 1000;
      let speed = 0;
      if (timeDelta > 0.4) {
        speed = Math.max(0, (currentBytes - lastBytes) / timeDelta);
        lastBytes = currentBytes;
        lastTime = now;
      }
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          progress: percent,
          speed: speed || t.speed,
          lastUpdated: now
        } : t)
      }));
    }, controller.signal, task.conflictStrategy || "rename");
    activeSimpleControllers.delete(taskId);
    fileMap.delete(taskId);
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: "completed",
        progress: 100,
        speed: 0,
        lastUpdated: Date.now()
      } : t)
    }));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storeit:file-uploaded"));
    }
  } catch (err) {
    activeSimpleControllers.delete(taskId);
    if (controller.signal.aborted) return;
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: "error",
        speed: 0,
        errorMessage: err.message || tr("上传失败", "Upload failed")
      } : t)
    }));
  } finally {
    scheduleNextUploads(get, set);
  }
}
async function executeChunkedUpload(taskId, file, get, set) {
  const task = get().tasks.find(t => t.id === taskId);
  if (!task) return;
  set(state => ({
    tasks: state.tasks.map(t => t.id === taskId ? {
      ...t,
      status: "initializing",
      errorMessage: undefined
    } : t)
  }));
  let realUploadId = taskId;
  let serverUploadedChunks = [];
  let totalChunks = task.totalChunks;
  let chunkSize = task.chunkSize;
  try {
    if (taskId.startsWith("task_")) {
      const initRes = await api.initChunkedUpload(file.name, file.size, task.directory, task.conflictStrategy || "rename");
      realUploadId = initRes.uploadId;
      totalChunks = initRes.totalChunks;
      chunkSize = initRes.chunkSize;
      fileMap.delete(taskId);
      fileMap.set(realUploadId, file);
      const pausedDuringHandshake = get().tasks.find(t => t.id === taskId)?.status === "paused";
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          id: realUploadId,
          totalChunks,
          chunkSize,
          uploadedChunks: [],
          status: pausedDuringHandshake ? "paused" : "uploading"
        } : t)
      }));
    } else {
      try {
        const statusRes = await api.getUploadStatus(taskId);
        serverUploadedChunks = statusRes.uploadedChunks || [];
        totalChunks = statusRes.totalChunks;
        chunkSize = statusRes.chunkSize;
        const pausedDuringHandshake = get().tasks.find(t => t.id === taskId)?.status === "paused";
        set(state => ({
          tasks: state.tasks.map(t => t.id === taskId ? {
            ...t,
            uploadedChunks: serverUploadedChunks,
            totalChunks,
            chunkSize,
            progress: Math.min(99, Math.floor(serverUploadedChunks.length / totalChunks * 100)),
            status: pausedDuringHandshake ? "paused" : "uploading"
          } : t)
        }));
      } catch (err) {
        if (err?.status !== 400) throw err;
        const initRes = await api.initChunkedUpload(file.name, file.size, task.directory, task.conflictStrategy || "rename");
        const previousId = taskId;
        realUploadId = initRes.uploadId;
        totalChunks = initRes.totalChunks;
        chunkSize = initRes.chunkSize;
        serverUploadedChunks = [];
        fileMap.delete(previousId);
        fileMap.set(realUploadId, file);
        activeChunkControllers.delete(previousId);
        const pausedDuringHandshake = get().tasks.find(t => t.id === previousId)?.status === "paused";
        set(state => ({
          tasks: state.tasks.map(t => t.id === previousId ? {
            ...t,
            id: realUploadId,
            uploadedChunks: [],
            progress: 0,
            totalChunks,
            chunkSize,
            errorMessage: undefined,
            status: pausedDuringHandshake ? "paused" : "uploading"
          } : t)
        }));
      }
    }
  } catch (err) {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        status: "error",
        errorMessage: tr(`初始化上传失败: ${err.message}`, `Failed to initialize upload: ${err.message}`)
      } : t)
    }));
    scheduleNextUploads(get, set);
    return;
  }
  if (!get().tasks.some(t => t.id === realUploadId)) {
    try {
      await api.cancelChunkedUpload(realUploadId);
    } catch {}
    return;
  }
  if (get().tasks.find(t => t.id === realUploadId)?.status !== "uploading") {
    return;
  }
  let controllers = activeChunkControllers.get(realUploadId);
  if (!controllers) {
    controllers = new Map();
    activeChunkControllers.set(realUploadId, controllers);
  }
  const inFlightBytes = new Map();
  const chunkRetryCount = new Map();
  const uploadedSet = new Set(serverUploadedChunks);
  const pendingChunks = [];
  for (let i = 0; i < totalChunks; i++) {
    if (!uploadedSet.has(i)) {
      pendingChunks.push(i);
    }
  }
  if (pendingChunks.length === 0) {
    await completeChunkedUploadSession(realUploadId, get, set);
    return;
  }
  const concurrency = get().concurrencyLimit || CONCURRENCY;
  let activeWorkers = 0;
  let isAbortedOrDone = false;
  let lastBytes = uploadedSet.size * chunkSize;
  let lastTime = Date.now();
  const progressInterval = setInterval(() => {
    const currentTask = get().tasks.find(t => t.id === realUploadId);
    if (!currentTask || currentTask.status !== "uploading") {
      clearInterval(progressInterval);
      return;
    }
    let inFlightSum = 0;
    inFlightBytes.forEach(b => inFlightSum += b);
    const totalBytesLoaded = Math.min(file.size, currentTask.uploadedChunks.length * chunkSize + inFlightSum);
    const now = Date.now();
    const timeDelta = (now - lastTime) / 1000;
    let speed = currentTask.speed;
    if (timeDelta > 0.5) {
      speed = Math.max(0, (totalBytesLoaded - lastBytes) / timeDelta);
      lastBytes = totalBytesLoaded;
      lastTime = now;
    }
    const calculatedProgress = Math.min(99, Math.floor(totalBytesLoaded / file.size * 100));
    set(state => ({
      tasks: state.tasks.map(t => t.id === realUploadId ? {
        ...t,
        progress: Math.max(t.progress, calculatedProgress),
        speed,
        lastUpdated: now
      } : t)
    }));
  }, 300);
  const next = async () => {
    if (isAbortedOrDone) return;
    const currentTask = get().tasks.find(t => t.id === realUploadId);
    if (!currentTask || currentTask.status !== "uploading") {
      isAbortedOrDone = true;
      clearInterval(progressInterval);
      return;
    }
    if (pendingChunks.length === 0) {
      if (activeWorkers === 0) {
        clearInterval(progressInterval);
        await completeChunkedUploadSession(realUploadId, get, set);
      }
      return;
    }
    const chunkIndex = pendingChunks.shift();
    activeWorkers++;
    const start = chunkIndex * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunkBlob = file.slice(start, end);
    const controller = new AbortController();
    controllers.set(chunkIndex, controller);
    try {
      await api.uploadChunk(realUploadId, chunkIndex, chunkBlob, controller.signal, loaded => {
        inFlightBytes.set(chunkIndex, loaded);
      });
      controllers.delete(chunkIndex);
      inFlightBytes.delete(chunkIndex);
      set(state => ({
        tasks: state.tasks.map(t => {
          if (t.id !== realUploadId) return t;
          const newUploaded = Array.from(new Set([...t.uploadedChunks, chunkIndex])).sort((a, b) => a - b);
          return {
            ...t,
            uploadedChunks: newUploaded,
            progress: Math.max(t.progress, Math.min(99, Math.floor(newUploaded.length / t.totalChunks * 100))),
            lastUpdated: Date.now()
          };
        })
      }));
    } catch (err) {
      controllers.delete(chunkIndex);
      inFlightBytes.delete(chunkIndex);
      if (err.name === "AbortError" || controller.signal.aborted) {
        return;
      }
      const retries = chunkRetryCount.get(chunkIndex) || 0;
      if (retries < 2) {
        chunkRetryCount.set(chunkIndex, retries + 1);
        pendingChunks.push(chunkIndex);
        setTimeout(() => next(), 500 * Math.pow(2, retries));
        return;
      } else {
        isAbortedOrDone = true;
        clearInterval(progressInterval);
        set(state => ({
          tasks: state.tasks.map(t => t.id === realUploadId ? {
            ...t,
            status: "error",
            speed: 0,
            errorMessage: tr(`分片 ${chunkIndex + 1} 上传失败: ${err.message}`, `Chunk ${chunkIndex + 1} upload failed: ${err.message}`)
          } : t)
        }));
        scheduleNextUploads(get, set);
        return;
      }
    } finally {
      activeWorkers--;
    }
    next();
  };
  for (let i = 0; i < concurrency; i++) {
    next();
  }
}
async function completeChunkedUploadSession(uploadId, get, set) {
  set(state => ({
    tasks: state.tasks.map(t => t.id === uploadId ? {
      ...t,
      status: "merging",
      progress: 99,
      speed: 0
    } : t)
  }));
  try {
    await api.completeChunkedUpload(uploadId);
    fileMap.delete(uploadId);
    activeChunkControllers.delete(uploadId);
    set(state => ({
      tasks: state.tasks.map(t => t.id === uploadId ? {
        ...t,
        status: "completed",
        progress: 100,
        speed: 0,
        lastUpdated: Date.now()
      } : t)
    }));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storeit:file-uploaded"));
    }
  } catch (err) {
    set(state => ({
      tasks: state.tasks.map(t => t.id === uploadId ? {
        ...t,
        status: "error",
        speed: 0,
        errorMessage: tr(`合并分片失败: ${err.message}`, `Failed to merge chunks: ${err.message}`)
      } : t)
    }));
  } finally {
    scheduleNextUploads(get, set);
  }
}
function Navbar() {
  const currentPath = useFileStore(s => s.currentPath);
  const layout = useFileStore(s => s.layout);
  const setLayout = useFileStore(s => s.setLayout);
  const theme = useFileStore(s => s.theme);
  const setTheme = useFileStore(s => s.setTheme);
  const searchQuery = useFileStore(s => s.searchQuery);
  const setSearchQuery = useFileStore(s => s.setSearchQuery);
  const viewMode = useFileStore(s => s.viewMode);
  const setViewMode = useFileStore(s => s.setViewMode);
  const setNewFolderModalOpen = useFileStore(s => s.setNewFolderModalOpen);
  const setNewFileModalOpen = useFileStore(s => s.setNewFileModalOpen);
  const setPasswordModalOpen = useFileStore(s => s.setPasswordModalOpen);
  const toggleSidebar = useFileStore(s => s.toggleSidebar);
  const {
    locale,
    isEn,
    localeAuto,
    setLocale,
    t
  } = useI18n();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const enqueueWithConflictCheck = useUploadStore(s => s.enqueueWithConflictCheck);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  useEffect(() => {
    const saved = getSavedTheme();
    applyThemeToDom(saved);
    useFileStore.setState({
      theme: saved
    });
    useFileStore.getState().syncLocaleFromBrowser();
  }, []);
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  const triggerSearch = rawValue => {
    const query = rawValue.trim();
    if (query) {
      setSearchQuery(query);
      if (useFileStore.getState().viewMode !== "search") {
        setViewMode("search");
      }
    } else {
      setSearchQuery("");
      if (useFileStore.getState().viewMode === "search") {
        setViewMode("files");
      }
    }
  };
  const handleSearchChange = val => {
    setLocalSearch(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      triggerSearch(val);
    }, 300);
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    triggerSearch(localSearch);
  };
  const handleFilesSelected = e => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (viewMode !== "files") setViewMode("files");
    const entries = [];
    for (let i = 0; i < files.length; i++) {
      entries.push({
        file: files[i],
        subPath: ""
      });
    }
    enqueueWithConflictCheck(entries, [], currentPath);
    e.target.value = "";
  };
  const handleFoldersSelected = e => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (viewMode !== "files") setViewMode("files");
    const entries = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relPath = file.webkitRelativePath || "";
      const pathParts = relPath.split("/");
      pathParts.pop();
      const subDir = pathParts.join("/");
      entries.push({
        file,
        subPath: subDir
      });
    }
    enqueueWithConflictCheck(entries, [], currentPath);
    e.target.value = "";
  };
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = "/login";
    }
  };
  const activeThemeMeta = THEME_OPTIONS.find(item => item.key === theme) || THEME_OPTIONS[0];
  const activeThemeLabel = isEn ? activeThemeMeta.labelEn : activeThemeMeta.label;
  return /*#__PURE__*/React.createElement("header", {
    className: "h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b flex items-center justify-between gap-3 sticky top-0 z-30 select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "md:hidden h-9 w-9 text-brand-primary",
    onClick: () => toggleSidebar(),
    title: t("打开侧边菜单", "Open sidebar menu")
  }, /*#__PURE__*/React.createElement(Menu, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      useFileStore.getState().setCurrentPath("");
      setViewMode("files");
    },
    className: "flex items-center gap-2.5 cursor-pointer group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105"
  }, /*#__PURE__*/React.createElement(HardDrive, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-lg text-brand-primary tracking-tight hidden sm:inline-block"
  }, isEn ? "StoreIt" : /*#__PURE__*/React.createElement(React.Fragment, null, "\u50A8\u4E4B ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-normal text-brand-secondary ml-0.5"
  }, "StoreIt"))))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearchSubmit,
    className: "relative flex-1 max-w-xs sm:max-w-md"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "search",
    placeholder: t("输入关键词实时搜索文件...", "Search files in real time..."),
    value: localSearch,
    onChange: e => handleSearchChange(e.target.value),
    className: "pl-9 h-9 bg-muted/40 border-0 focus-visible:bg-white focus-visible:ring-1 rounded-xl text-xs transition-all duration-150"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 sm:gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    multiple: true,
    className: "hidden",
    onChange: handleFilesSelected
  }), /*#__PURE__*/React.createElement("input", {
    ref: folderInputRef,
    type: "file"
    // @ts-ignore
    ,
    webkitdirectory: "",
    multiple: true,
    className: "hidden",
    onChange: handleFoldersSelected
  }), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    className: "gap-1.5 rounded-xl shadow-sm px-2.5 sm:px-3"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, t("上传", "Upload")), /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-3.5 h-3.5 opacity-60"
  }))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-52 storeit-menu-pop"
  }, /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => fileInputRef.current?.click(),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("上传单个 / 多文件", "Upload Files")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => folderInputRef.current?.click(),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("上传整个文件夹", "Upload Folder")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setNewFileModalOpen(true),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FilePlus2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("新建文本 / Markdown", "New Text / Markdown")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setNewFolderModalOpen(true),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-4 h-4 text-amber-500"
  }), t("新建文件夹", "New Folder")))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setNewFileModalOpen(true),
    className: "gap-1.5 rounded-xl hidden lg:flex",
    title: t("新建空白文本或 Markdown 文档", "Create a new text or Markdown file")
  }, /*#__PURE__*/React.createElement(FilePlus2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("新建文件", "New File")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setNewFolderModalOpen(true),
    className: "gap-1.5 rounded-xl hidden sm:flex"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-4 h-4 text-amber-500"
  }), t("新建文件夹", "New Folder")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border rounded-xl p-0.5 bg-muted/40"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: `h-7 w-7 rounded-lg transition-all duration-150 ${layout === "grid" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`,
    onClick: () => setLayout("grid"),
    title: t("网格视图", "Grid view")
  }, /*#__PURE__*/React.createElement(LayoutGrid, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: `h-7 w-7 rounded-lg transition-all duration-150 ${layout === "list" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`,
    onClick: () => setLayout("list"),
    title: t("列表视图", "List view")
  }, /*#__PURE__*/React.createElement(List, {
    className: "w-3.5 h-3.5"
  }))), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    className: "gap-1.5 px-2.5 h-9 rounded-xl border border-transparent hover:border-border",
    title: t("切换语言 (Language)", "Switch Language")
  }, /*#__PURE__*/React.createElement(Globe, {
    className: "w-4 h-4 text-brand-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium text-foreground hidden md:inline"
  }, isEn ? "EN" : "中文"))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-52 storeit-menu-pop p-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2.5 py-1.5 border-b mb-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-brand-primary"
  }, t("界面语言 (Language)", "Language")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground"
  }, t("非中文浏览器自动切换为英文", "Auto-switches to English on non-Chinese browsers"))), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setLocale("auto"),
    className: "flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: `text-xs ${localeAuto ? "font-bold text-brand-primary" : "font-medium"}`
  }, t("跟随浏览器 (自动)", "Follow Browser (Auto)")), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-muted-foreground"
  }, t("根据系统/浏览器语言自动匹配", "Detect from browser language"))), localeAuto && /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-brand-primary shrink-0"
  })), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setLocale("zh"),
    className: "flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs ${!localeAuto && locale === "zh" ? "font-bold text-brand-primary" : "font-medium"}`
  }, "\u7B80\u4F53\u4E2D\u6587 (zh-CN)"), !localeAuto && locale === "zh" && /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-brand-primary shrink-0"
  })), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setLocale("en"),
    className: "flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs ${!localeAuto && locale === "en" ? "font-bold text-brand-primary" : "font-medium"}`
  }, "English (en-US)"), !localeAuto && locale === "en" && /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-brand-primary shrink-0"
  })))), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    className: "gap-1.5 px-2.5 h-9 rounded-xl border border-transparent hover:border-border",
    title: `${t("切换界面主题", "Switch Theme")} (${activeThemeLabel})`
  }, /*#__PURE__*/React.createElement(Palette, {
    className: "w-4 h-4 text-brand-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full border border-white shadow-sm shrink-0",
    style: {
      backgroundColor: activeThemeMeta.swatch
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium text-foreground hidden xl:inline"
  }, activeThemeLabel))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-56 storeit-menu-pop p-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2.5 py-1.5 border-b mb-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-brand-primary"
  }, t("界面主题色切换", "Theme Palette")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground"
  }, t("选择配色方案（自动记忆）", "Choose a color palette (auto-saved)"))), THEME_OPTIONS.map(opt => {
    const active = theme === opt.key;
    return /*#__PURE__*/React.createElement(DropdownMenuItem, {
      key: opt.key,
      onClick: () => setTheme(opt.key),
      className: "flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 min-w-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0",
      style: {
        backgroundColor: opt.swatch
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: `text-xs ${active ? "font-bold text-brand-primary" : "font-medium text-foreground"}`
    }, isEn ? opt.labelEn : opt.label), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-muted-foreground truncate"
    }, isEn ? opt.descEn : opt.desc))), active && /*#__PURE__*/React.createElement(Check, {
      className: "w-3.5 h-3.5 text-brand-primary shrink-0"
    }));
  }))), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    className: "gap-2 pl-2 pr-2 sm:pr-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs"
  }, user?.username?.charAt(0).toUpperCase() || "U"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-foreground hidden sm:inline"
  }, user?.username))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-48 storeit-menu-pop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2 border-b"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold truncate"
  }, user?.username), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, t("角色", "Role"), ": ", user?.role || "USER")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => setPasswordModalOpen(true),
    className: "gap-2 cursor-pointer"
  }, /*#__PURE__*/React.createElement(KeyRound, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("修改登录口令", "Change Password")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: handleLogout,
    className: "gap-2 text-destructive focus:text-destructive cursor-pointer"
  }, /*#__PURE__*/React.createElement(LogOut, {
    className: "w-4 h-4"
  }), t("退出登录", "Sign Out"))))));
}
function Sidebar() {
  const queryClient = useQueryClient();
  const viewMode = useFileStore(s => s.viewMode);
  const setViewMode = useFileStore(s => s.setViewMode);
  const setCurrentPath = useFileStore(s => s.setCurrentPath);
  const selectedFile = useFileStore(s => s.selectedFile);
  const setSelectedFile = useFileStore(s => s.setSelectedFile);
  const openContainingFolder = useFileStore(s => s.openContainingFolder);
  const setPreviewFile = useFileStore(s => s.setPreviewFile);
  const openEditor = useFileStore(s => s.openEditor);
  const setShareModalFile = useFileStore(s => s.setShareModalFile);
  const setMoveModalFile = useFileStore(s => s.setMoveModalFile);
  const setRenameModalFile = useFileStore(s => s.setRenameModalFile);
  const sidebarOpen = useFileStore(s => s.sidebarOpen);
  const setSidebarOpen = useFileStore(s => s.setSidebarOpen);
  const showToast = useFileStore(s => s.showToast);
  const openConfirm = useFileStore(s => s.openConfirm);
  const {
    locale,
    t
  } = useI18n();
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const {
    data: quota
  } = useQuery({
    queryKey: ["quota"],
    queryFn: () => api.getQuota()
  });
  const {
    data: favoritesData
  } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: () => api.getFavorites()
  });
  const isFavorite = Boolean(selectedFile && (favoritesData || []).some(f => f.path === selectedFile.path));
  const deleteMutation = useMutation({
    mutationFn: path => api.deleteFile(path),
    onSuccess: () => {
      setSelectedFile(null);
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      showToast(t("删除成功", "Deleted successfully"), "success");
    },
    onError: err => showToast(err.message || t("删除失败", "Failed to delete"), "error")
  });
  const favoriteMutation = useMutation({
    mutationFn: ({
      path,
      favorite
    }) => api.setFavorite(path, favorite),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      showToast(vars.favorite ? t("已加入收藏夹", "Added to favorites") : t("已取消收藏", "Removed from favorites"), "success");
    },
    onError: err => showToast(err.message || t("收藏操作失败", "Failed to update favorite"), "error")
  });
  const navItems = [{
    mode: "files",
    label: t("我的文件", "My Files"),
    icon: /*#__PURE__*/React.createElement(Folder, {
      className: "w-4 h-4"
    })
  }, {
    mode: "recent",
    label: t("最近访问", "Recent"),
    icon: /*#__PURE__*/React.createElement(Clock, {
      className: "w-4 h-4"
    })
  }, {
    mode: "favorites",
    label: t("收藏夹", "Favorites"),
    icon: /*#__PURE__*/React.createElement(Star, {
      className: "w-4 h-4"
    })
  }, {
    mode: "shares",
    label: t("我的分享", "Shares & Mounts"),
    icon: /*#__PURE__*/React.createElement(Share2, {
      className: "w-4 h-4"
    })
  }, {
    mode: "admin",
    label: t("用户管理", "Users & Invites"),
    icon: /*#__PURE__*/React.createElement(Users, {
      className: "w-4 h-4"
    }),
    adminOnly: true
  }, {
    mode: "settings",
    label: t("系统设置", "Settings"),
    icon: /*#__PURE__*/React.createElement(Settings, {
      className: "w-4 h-4"
    }),
    adminOnly: true
  }, {
    mode: "about",
    label: t("关于 储之", "About StoreIt"),
    icon: /*#__PURE__*/React.createElement(Info, {
      className: "w-4 h-4"
    })
  }];
  const handleNavClick = mode => {
    if (mode === "files") {
      setCurrentPath("");
    }
    setViewMode(mode);
    setSidebarOpen(false);
  };
  const percent = quota && quota.total > 0 ? quota.used / quota.total * 100 : 0;
  const storageColor = percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-brand-primary";
  const getCategoryLabel = (name, isDir) => {
    if (isDir) return t("文件夹", "Folder");
    const cat = getFileCategory(name);
    switch (cat) {
      case "image":
        return t("图片", "Image");
      case "video":
        return t("视频", "Video");
      case "audio":
        return t("音频", "Audio");
      case "pdf":
        return t("PDF 文档", "PDF Document");
      case "code":
        return t("文本/代码", "Text / Code");
      case "archive":
        return t("压缩包", "Archive");
      case "document":
        return t("Office 文档", "Office Document");
      default:
        return t("文件", "File");
    }
  };
  const renderFileIcon = (name, isDir) => {
    if (isDir) return /*#__PURE__*/React.createElement(Folder, {
      className: "w-5 h-5 text-amber-500"
    });
    const cat = getFileCategory(name);
    switch (cat) {
      case "image":
        return /*#__PURE__*/React.createElement(FileImage, {
          className: "w-5 h-5 text-purple-500"
        });
      case "video":
        return /*#__PURE__*/React.createElement(FileVideo, {
          className: "w-5 h-5 text-rose-500"
        });
      case "audio":
        return /*#__PURE__*/React.createElement(FileAudio, {
          className: "w-5 h-5 text-emerald-500"
        });
      case "pdf":
        return /*#__PURE__*/React.createElement(FileText, {
          className: "w-5 h-5 text-red-500"
        });
      case "code":
        return /*#__PURE__*/React.createElement(FileCode, {
          className: "w-5 h-5 text-blue-500"
        });
      case "archive":
        return /*#__PURE__*/React.createElement(FileArchive, {
          className: "w-5 h-5 text-amber-600"
        });
      default:
        return /*#__PURE__*/React.createElement(FileText, {
          className: "w-5 h-5 text-muted-foreground"
        });
    }
  };
  const sidebarContent = /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full overflow-hidden select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:hidden flex items-center justify-between p-4 border-b"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-brand-primary text-sm"
  }, t("导航与详情", "Navigation & Details")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    onClick: () => setSidebarOpen(false),
    className: "h-8 w-8"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 space-y-1 overflow-y-auto"
  }, navItems.map(item => {
    if (item.adminOnly && !isAdmin) return null;
    const isActive = viewMode === item.mode;
    return /*#__PURE__*/React.createElement("button", {
      key: item.mode,
      onClick: () => handleNavClick(item.mode),
      className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-brand-primary text-white shadow-sm" : "text-muted-foreground hover:bg-black/5 hover:text-foreground"}`
    }, item.icon, /*#__PURE__*/React.createElement("span", null, item.label));
  })), quota && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 mx-3 my-2 bg-black/[0.03] rounded-2xl border border-black/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(HardDrive, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("存储空间", "Storage")), /*#__PURE__*/React.createElement("span", null, quota.unlimited && quota.scope === "user" ? `${formatBytes(quota.used)} / ${t("无限制", "Unlimited")}` : `${formatBytes(quota.used)} / ${formatBytes(quota.total)}`)), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1.5 bg-black/10 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full transition-all duration-300 ${storageColor}`,
    style: {
      width: `${Math.min(100, Math.max(0, percent))}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto border-t p-4 bg-white/40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider"
  }, t("文件属性与详情", "File Properties")), selectedFile && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-5 w-5 text-muted-foreground hover:text-foreground",
    onClick: () => setSelectedFile(null),
    title: t("关闭详情", "Close details")
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3 h-3"
  }))), selectedFile ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 animate-in fade-in-50 duration-150 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 shrink-0"
  }, renderFileIcon(selectedFile.name, selectedFile.isDirectory)), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-foreground truncate",
    title: selectedFile.name
  }, selectedFile.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5"
  }, /*#__PURE__*/React.createElement("span", null, getCategoryLabel(selectedFile.name, selectedFile.isDirectory)), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, selectedFile.isDirectory ? t("目录", "Directory") : formatBytes(selectedFile.size || 0))))), selectedFile.modifiedTime && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 text-[11px] text-muted-foreground"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "w-3.5 h-3.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, formatDate(selectedFile.modifiedTime, locale))), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-muted-foreground break-all bg-black/[0.03] p-1.5 rounded font-mono"
  }, "/", selectedFile.path), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1.5 pt-1"
  }, !selectedFile.isDirectory && isPreviewable(selectedFile.name) && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setPreviewFile(selectedFile)
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("预览", "Preview")), !selectedFile.isDirectory && isEditableText(selectedFile.name) && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => openEditor(selectedFile)
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("编辑", "Edit")), !selectedFile.isDirectory && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    asChild: true
  }, /*#__PURE__*/React.createElement("a", {
    href: getDownloadUrl(selectedFile.path),
    download: selectedFile.name
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("下载", "Download"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setShareModalFile(selectedFile)
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-3 h-3 text-brand-secondary"
  }), selectedFile.isDirectory ? t("共享", "Share Folder") : t("分享", "Share")), viewMode !== "files" && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => openContainingFolder(selectedFile)
  }, /*#__PURE__*/React.createElement(FolderOpen, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("所在目录", "Open Location")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: `h-7 text-xs gap-1 ${isFavorite ? "text-amber-600 border-amber-300" : ""}`,
    onClick: () => favoriteMutation.mutate({
      path: selectedFile.path,
      favorite: !isFavorite
    })
  }, /*#__PURE__*/React.createElement(Star, {
    className: `w-3 h-3 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`
  }), isFavorite ? t("取消收藏", "Unfavorite") : t("加入收藏", "Favorite")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setRenameModalFile(selectedFile)
  }, /*#__PURE__*/React.createElement(Edit2, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("重命名", "Rename")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setMoveModalFile(selectedFile)
  }, /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("移动", "Move")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "col-span-2 h-7 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/20",
    onClick: () => {
      openConfirm({
        title: t("确认彻底删除", "Confirm Permanent Deletion"),
        description: t(`确定要彻底删除 "${selectedFile.name}" 吗？此操作不可撤销！`, `Are you sure you want to permanently delete "${selectedFile.name}"? This action cannot be undone.`),
        confirmText: t("彻底删除", "Delete"),
        destructive: true,
        onConfirm: () => deleteMutation.mutate(selectedFile.path)
      });
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  }), t("删除", "Delete")))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-6 text-muted-foreground/60 text-xs"
  }, t("选择文件以查看详细属性与操作", "Select a file to view properties & actions"))));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
    className: "hidden md:flex w-64 border-r bg-white/50 backdrop-blur-sm flex-col shrink-0"
  }, sidebarContent), sidebarOpen && /*#__PURE__*/React.createElement("div", {
    className: "md:hidden fixed inset-0 z-50 flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/40 backdrop-blur-sm",
    onClick: () => setSidebarOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-72 max-w-[80vw] h-full bg-white shadow-2xl z-10 flex flex-col"
  }, sidebarContent)));
}
function Breadcrumb() {
  const currentPath = useFileStore(s => s.currentPath);
  const setCurrentPath = useFileStore(s => s.setCurrentPath);
  const viewMode = useFileStore(s => s.viewMode);
  const setViewMode = useFileStore(s => s.setViewMode);
  const {
    t
  } = useI18n();
  if (viewMode !== "files" && viewMode !== "search") {
    const titles = {
      recent: t("最近访问", "Recent"),
      favorites: t("收藏夹", "Favorites"),
      shares: t("我的分享", "Shares & Mounts"),
      admin: t("用户管理", "Users & Invites"),
      settings: t("系统设置", "Settings"),
      about: t("关于", "About")
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 text-sm text-muted-foreground py-2 select-none"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setViewMode("files");
        setCurrentPath("");
      },
      className: "hover:text-brand-primary flex items-center gap-1 transition-colors"
    }, /*#__PURE__*/React.createElement(Home, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, t("首页", "Home"))), /*#__PURE__*/React.createElement(ChevronRight, {
      className: "w-3.5 h-3.5 text-black/30"
    }), /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-brand-primary"
    }, titles[viewMode] || viewMode));
  }
  const parts = currentPath ? currentPath.split("/").filter(Boolean) : [];
  return /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center gap-1.5 text-sm text-muted-foreground py-2 select-none overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setViewMode("files");
      setCurrentPath("");
    },
    className: "hover:text-brand-primary flex items-center gap-1 transition-colors shrink-0"
  }, /*#__PURE__*/React.createElement(Home, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, t("首页", "Home"))), parts.map((part, idx) => {
    const pathUpToHere = parts.slice(0, idx + 1).join("/");
    const isLast = idx === parts.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: pathUpToHere
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      className: "w-3.5 h-3.5 text-black/30 shrink-0"
    }), isLast ? /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-brand-primary shrink-0 truncate max-w-[200px]"
    }, part) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setCurrentPath(pathUpToHere),
      className: "hover:text-brand-primary transition-colors shrink-0 truncate max-w-[150px]"
    }, part));
  }));
}
function DropZone({
  children
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const queryClient = useQueryClient();
  const currentPath = useFileStore(s => s.currentPath);
  const viewMode = useFileStore(s => s.viewMode);
  const setViewMode = useFileStore(s => s.setViewMode);
  const enqueueWithConflictCheck = useUploadStore(s => s.enqueueWithConflictCheck);
  const {
    t
  } = useI18n();
  const handleDragEnter = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMode !== "files" && viewMode !== "recent" && viewMode !== "favorites" && viewMode !== "search") return;
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, [viewMode]);
  const handleDragLeave = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setIsDragOver(false);
      dragCounter.current = 0;
    }
  }, []);
  const handleDragOver = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback(async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;
    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;
    if (viewMode !== "files") {
      setViewMode("files");
    }
    const filesToUpload = [];
    const emptyDirsToCreate = [];
    const readEntry = async (entry, relativeDir) => {
      if (entry.isFile) {
        await new Promise(resolve => {
          entry.file(file => {
            filesToUpload.push({
              file,
              subPath: relativeDir
            });
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const allChildren = [];
        const readEntries = async () => {
          const entries = await new Promise(resolve => {
            dirReader.readEntries(results => resolve(results));
          });
          if (entries.length > 0) {
            allChildren.push(...entries);
            await readEntries();
          }
        };
        await readEntries();
        const thisDir = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
        if (allChildren.length === 0) {
          emptyDirsToCreate.push(thisDir);
        } else {
          for (const child of allChildren) {
            await readEntry(child, thisDir);
          }
        }
      }
    };
    const entryPromises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (typeof item.webkitGetAsEntry === "function") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          entryPromises.push(readEntry(entry, ""));
        }
      } else if (item.kind === "file") {
        const f = item.getAsFile();
        if (f) filesToUpload.push({
          file: f,
          subPath: ""
        });
      }
    }
    await Promise.all(entryPromises);
    await enqueueWithConflictCheck(filesToUpload, emptyDirsToCreate, currentPath);
    queryClient.invalidateQueries({
      queryKey: ["files"]
    });
  }, [currentPath, viewMode, setViewMode, enqueueWithConflictCheck, queryClient]);
  return /*#__PURE__*/React.createElement("div", {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    className: "relative flex-1 flex flex-col h-full overflow-hidden"
  }, isDragOver && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-primary/80 backdrop-blur-sm text-white animate-in fade-in-0 duration-150 p-6 pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mb-6 shadow-2xl animate-bounce"
  }, /*#__PURE__*/React.createElement(UploadCloud, {
    className: "w-12 h-12 text-white"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold mb-2"
  }, t("释放鼠标立即上传", "Drop files or folders to upload")), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 text-sm max-w-md text-center flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-4 h-4"
  }), t("目标目录：", "Destination: "), /*#__PURE__*/React.createElement("span", {
    className: "font-mono bg-white/20 px-2 py-0.5 rounded text-white font-medium"
  }, "/", currentPath || t("根目录", "root"))), /*#__PURE__*/React.createElement("p", {
    className: "text-white/60 text-xs mt-3"
  }, t("支持单文件、特大文件以及多级文件夹（含空目录）递归拖入上传", "Supports single files, ultra-large files, and recursive multi-level folder uploads"))), children);
}
function FileCard({
  item,
  index = 0,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  onShare,
  onMove,
  onCopy,
  onRename,
  onPreview,
  onContextMenu
}) {
  const selectedFile = useFileStore(s => s.selectedFile);
  const setSelectedFile = useFileStore(s => s.setSelectedFile);
  const selectedPaths = useFileStore(s => s.selectedPaths);
  const toggleSelectPath = useFileStore(s => s.toggleSelectPath);
  const viewMode = useFileStore(s => s.viewMode);
  const openContainingFolder = useFileStore(s => s.openContainingFolder);
  const openEditor = useFileStore(s => s.openEditor);
  const openCopyModal = useFileStore(s => s.openCopyModal);
  const {
    t
  } = useI18n();
  const isSelected = selectedFile?.path === item.path;
  const isChecked = selectedPaths.includes(item.path);
  const parentDir = getParentDirectory(item.path);
  const showParentBadge = viewMode !== "files" && Boolean(parentDir);
  const renderIcon = () => {
    if (item.isDirectory) {
      return /*#__PURE__*/React.createElement(Folder, {
        className: "w-12 h-12 text-amber-500 fill-amber-500/20 transition-transform duration-200 group-hover:scale-105"
      });
    }
    const cat = getFileCategory(item.name);
    const cls = "w-12 h-12 transition-transform duration-200 group-hover:scale-105";
    switch (cat) {
      case "image":
        return /*#__PURE__*/React.createElement(FileImage, {
          className: `${cls} text-purple-500`
        });
      case "video":
        return /*#__PURE__*/React.createElement(FileVideo, {
          className: `${cls} text-rose-500`
        });
      case "audio":
        return /*#__PURE__*/React.createElement(FileAudio, {
          className: `${cls} text-emerald-500`
        });
      case "code":
        return /*#__PURE__*/React.createElement(FileCode, {
          className: `${cls} text-blue-500`
        });
      case "archive":
        return /*#__PURE__*/React.createElement(FileArchive, {
          className: `${cls} text-amber-600`
        });
      case "pdf":
        return /*#__PURE__*/React.createElement(FileText, {
          className: `${cls} text-red-500`
        });
      case "document":
        return /*#__PURE__*/React.createElement(FileText, {
          className: `${cls} text-sky-500`
        });
      default:
        return /*#__PURE__*/React.createElement(FileText, {
          className: `${cls} text-muted-foreground`
        });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      animationDelay: `${Math.min(index * 15, 180)}ms`
    },
    onClick: e => {
      if (e.ctrlKey || e.metaKey) {
        toggleSelectPath(item.path);
      }
      setSelectedFile(item);
    },
    onDoubleClick: () => onOpen(item),
    onContextMenu: e => onContextMenu?.(e, item),
    className: `storeit-card-enter group relative flex flex-col items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-white border cursor-pointer shadow-sm hover:shadow-md select-none ${isChecked || isSelected ? "ring-2 ring-brand-primary border-transparent bg-white shadow-md" : "hover:-translate-y-1"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full flex items-center justify-between text-muted-foreground"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      toggleSelectPath(item.path);
    },
    className: `w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? "bg-brand-primary border-brand-primary text-white opacity-100 scale-105" : "border-black/25 bg-white/80 opacity-0 group-hover:opacity-100"}`,
    title: isChecked ? t("取消选择", "Deselect") : t("多选此项", "Select item")
  }, isChecked && /*#__PURE__*/React.createElement(Check, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggleFavorite(item);
    },
    className: `hover:text-amber-500 transition-transform active:scale-125 ${item.isFavorite ? "text-amber-500 fill-amber-500 opacity-100" : "opacity-60 group-hover:opacity-100"}`,
    title: item.isFavorite ? t("取消收藏", "Remove favorite") : t("加入收藏", "Add to favorites")
  }, /*#__PURE__*/React.createElement(Star, {
    className: `w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`
  }))), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-6 w-6 opacity-60 group-hover:opacity-100"
  }, /*#__PURE__*/React.createElement(MoreVertical, {
    className: "w-3.5 h-3.5"
  }))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-48 storeit-menu-pop"
  }, !item.isDirectory ? /*#__PURE__*/React.createElement(React.Fragment, null, isPreviewable(item.name) && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onPreview(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("预览", "Preview")), isEditableText(item.name) && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => openEditor(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("在线编辑", "Online Edit")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDownload(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("下载", "Download")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onShare(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("分享", "Share")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDownload(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("打包下载 (.zip)", "Download ZIP (.zip)")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onShare(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("共享文件夹 (R/RW)", "Share Folder (R/RW)")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null)), viewMode !== "files" && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => openContainingFolder(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderOpen, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("打开所在目录", "Open Containing Folder")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onRename(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Edit2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("重命名", "Rename")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onMove(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("移动到...", "Move to...")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onCopy ? onCopy(item) : openCopyModal(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Copy, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("复制到...", "Copy to...")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDelete(item),
    className: "gap-2 text-destructive focus:text-destructive"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-4 h-4"
  }), t("删除", "Delete"))))), /*#__PURE__*/React.createElement("div", {
    className: "my-2"
  }, renderIcon()), /*#__PURE__*/React.createElement("div", {
    className: "w-full text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-medium text-foreground truncate px-1",
    title: item.name
  }, item.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground block mt-0.5 truncate"
  }, item.isDirectory ? t("文件夹", "Folder") : formatBytes(item.size || 0), showParentBadge ? ` · /${parentDir}` : "")));
}
function FileTableRow({
  item,
  index = 0,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  onShare,
  onMove,
  onCopy,
  onRename,
  onPreview,
  onContextMenu
}) {
  const selectedFile = useFileStore(s => s.selectedFile);
  const setSelectedFile = useFileStore(s => s.setSelectedFile);
  const selectedPaths = useFileStore(s => s.selectedPaths);
  const toggleSelectPath = useFileStore(s => s.toggleSelectPath);
  const viewMode = useFileStore(s => s.viewMode);
  const openContainingFolder = useFileStore(s => s.openContainingFolder);
  const openEditor = useFileStore(s => s.openEditor);
  const openCopyModal = useFileStore(s => s.openCopyModal);
  const {
    locale,
    t
  } = useI18n();
  const isSelected = selectedFile?.path === item.path;
  const isChecked = selectedPaths.includes(item.path);
  const parentDir = getParentDirectory(item.path);
  const showParentBadge = viewMode !== "files" && Boolean(parentDir);
  const renderIcon = () => {
    if (item.isDirectory) {
      return /*#__PURE__*/React.createElement(Folder, {
        className: "w-5 h-5 text-amber-500 fill-amber-500/20"
      });
    }
    const cat = getFileCategory(item.name);
    switch (cat) {
      case "image":
        return /*#__PURE__*/React.createElement(FileImage, {
          className: "w-5 h-5 text-purple-500"
        });
      case "video":
        return /*#__PURE__*/React.createElement(FileVideo, {
          className: "w-5 h-5 text-rose-500"
        });
      case "audio":
        return /*#__PURE__*/React.createElement(FileAudio, {
          className: "w-5 h-5 text-emerald-500"
        });
      case "code":
        return /*#__PURE__*/React.createElement(FileCode, {
          className: "w-5 h-5 text-blue-500"
        });
      case "archive":
        return /*#__PURE__*/React.createElement(FileArchive, {
          className: "w-5 h-5 text-amber-600"
        });
      case "pdf":
        return /*#__PURE__*/React.createElement(FileText, {
          className: "w-5 h-5 text-red-500"
        });
      default:
        return /*#__PURE__*/React.createElement(FileText, {
          className: "w-5 h-5 text-muted-foreground"
        });
    }
  };
  return /*#__PURE__*/React.createElement("tr", {
    style: {
      animationDelay: `${Math.min(index * 12, 150)}ms`
    },
    onClick: e => {
      if (e.ctrlKey || e.metaKey) {
        toggleSelectPath(item.path);
      }
      setSelectedFile(item);
    },
    onDoubleClick: () => onOpen(item),
    onContextMenu: e => onContextMenu?.(e, item),
    className: `storeit-row-enter border-b transition-colors cursor-pointer select-none group ${isChecked || isSelected ? "bg-brand-primary/10" : "hover:bg-white/80"}`
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 w-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      toggleSelectPath(item.path);
    },
    className: `w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? "bg-brand-primary border-brand-primary text-white scale-105" : "border-black/25 bg-white hover:border-brand-primary"}`
  }, isChecked && /*#__PURE__*/React.createElement(Check, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggleFavorite(item);
    },
    className: `text-muted-foreground/40 hover:text-amber-500 transition-transform active:scale-125 ${item.isFavorite ? "text-amber-500 fill-amber-500 opacity-100" : ""}`
  }, /*#__PURE__*/React.createElement(Star, {
    className: `w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`
  })))), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shrink-0 transition-transform duration-150 group-hover:scale-105"
  }, renderIcon()), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-sm text-foreground truncate block max-w-md",
    title: item.name
  }, item.name), showParentBadge && /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground font-mono block truncate"
  }, t("所在目录", "Location"), ": /", parentDir)))), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap"
  }, item.isDirectory ? "--" : formatBytes(item.size || 0)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell"
  }, formatDate(item.modifiedTime, locale)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-right"
  }, /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownMenuTrigger, {
    asChild: true,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-7 w-7 opacity-0 group-hover:opacity-100"
  }, /*#__PURE__*/React.createElement(MoreHorizontal, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement(DropdownMenuContent, {
    align: "end",
    className: "w-48 storeit-menu-pop"
  }, !item.isDirectory ? /*#__PURE__*/React.createElement(React.Fragment, null, isPreviewable(item.name) && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onPreview(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("预览", "Preview")), isEditableText(item.name) && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => openEditor(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("在线编辑", "Online Edit")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDownload(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("下载", "Download")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onShare(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("分享", "Share")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDownload(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("打包下载 (.zip)", "Download ZIP (.zip)")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onShare(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("共享文件夹 (R/RW)", "Share Folder (R/RW)")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null)), viewMode !== "files" && /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => openContainingFolder(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderOpen, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("打开所在目录", "Open Containing Folder")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onRename(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Edit2, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("重命名", "Rename")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onMove(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("移动到...", "Move to...")), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onCopy ? onCopy(item) : openCopyModal(item),
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Copy, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("复制到...", "Copy to...")), /*#__PURE__*/React.createElement(DropdownMenuSeparator, null), /*#__PURE__*/React.createElement(DropdownMenuItem, {
    onClick: () => onDelete(item),
    className: "gap-2 text-destructive focus:text-destructive"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-4 h-4"
  }), t("删除", "Delete"))))));
}
function FileList() {
  const queryClient = useQueryClient();
  const currentPath = useFileStore(s => s.currentPath);
  const viewMode = useFileStore(s => s.viewMode);
  const layout = useFileStore(s => s.layout);
  const sortBy = useFileStore(s => s.sortBy);
  const sortOrder = useFileStore(s => s.sortOrder);
  const setSort = useFileStore(s => s.setSort);
  const searchQuery = useFileStore(s => s.searchQuery);
  const selectedPaths = useFileStore(s => s.selectedPaths);
  const setSelectedPaths = useFileStore(s => s.setSelectedPaths);
  const clearSelection = useFileStore(s => s.clearSelection);
  const openFolder = useFileStore(s => s.openFolder);
  const openContainingFolder = useFileStore(s => s.openContainingFolder);
  const setSelectedFile = useFileStore(s => s.setSelectedFile);
  const setPreviewFile = useFileStore(s => s.setPreviewFile);
  const openEditor = useFileStore(s => s.openEditor);
  const setShareModalFile = useFileStore(s => s.setShareModalFile);
  const setMoveModalFile = useFileStore(s => s.setMoveModalFile);
  const setBatchMovePaths = useFileStore(s => s.setBatchMovePaths);
  const openCopyModal = useFileStore(s => s.openCopyModal);
  const openBatchCopyModal = useFileStore(s => s.openBatchCopyModal);
  const setRenameModalFile = useFileStore(s => s.setRenameModalFile);
  const showToast = useFileStore(s => s.showToast);
  const openConfirm = useFileStore(s => s.openConfirm);
  const {
    locale,
    t
  } = useI18n();
  const [contextMenu, setContextMenu] = useState(null);
  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    window.addEventListener("scroll", handleCloseMenu, true);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
      window.removeEventListener("scroll", handleCloseMenu, true);
    };
  }, []);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["files", viewMode, viewMode === "search" ? searchQuery : currentPath],
    queryFn: async () => {
      if (viewMode === "recent") return api.getRecent();
      if (viewMode === "favorites") return api.getFavorites();
      if (viewMode === "search") return api.searchFiles(searchQuery);
      const res = await api.getFiles(currentPath);
      return res.items;
    }
  });
  const {
    data: favoritesData
  } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: () => api.getFavorites()
  });
  const favoritesSet = useMemo(() => {
    return new Set((favoritesData || []).map(f => f.path));
  }, [favoritesData]);
  const uploadTimerRef = useRef(null);
  useEffect(() => {
    const handleUploaded = () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
      uploadTimerRef.current = setTimeout(() => {
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["quota"]
        });
      }, 300);
    };
    window.addEventListener("storeit:file-uploaded", handleUploaded);
    return () => {
      window.removeEventListener("storeit:file-uploaded", handleUploaded);
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [refetch, queryClient]);
  const deleteMutation = useMutation({
    mutationFn: path => api.deleteFile(path),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      queryClient.invalidateQueries({
        queryKey: ["shares"]
      });
      setSelectedFile(null);
      showToast(t("删除成功", "Deleted successfully"), "success");
    },
    onError: err => showToast(err.message || t("删除文件失败", "Failed to delete file"), "error")
  });
  const batchDeleteMutation = useMutation({
    mutationFn: paths => api.batchDeleteFiles(paths),
    onSuccess: (_res, paths) => {
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      queryClient.invalidateQueries({
        queryKey: ["shares"]
      });
      setSelectedFile(null);
      clearSelection();
      showToast(t(`已成功删除 ${paths.length} 个项目`, `Deleted ${paths.length} items`), "success");
    },
    onError: err => showToast(err.message || t("批量删除失败", "Batch delete failed"), "error")
  });
  const favoriteMutation = useMutation({
    mutationFn: ({
      path,
      favorite
    }) => api.setFavorite(path, favorite),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      refetch();
      showToast(vars.favorite ? t("已加入收藏夹", "Added to favorites") : t("已取消收藏", "Removed from favorites"), "success");
    },
    onError: err => showToast(err.message || t("更新收藏失败", "Failed to update favorite"), "error")
  });
  const handleOpen = item => {
    if (item.isDirectory) {
      openFolder(item.path);
    } else {
      setPreviewFile(item);
    }
  };
  const handleDownload = item => {
    const link = document.createElement("a");
    if (item.isDirectory) {
      link.href = getZipDownloadUrl([item.path]);
      link.download = `${item.name}.zip`;
      showToast(t(`正在打包下载文件夹 "${item.name}.zip"...`, `Downloading folder "${item.name}.zip"...`), "info");
    } else {
      link.href = getDownloadUrl(item.path);
      link.download = item.name;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleBatchDownload = () => {
    if (selectedPaths.length === 0) return;
    const link = document.createElement("a");
    link.href = getZipDownloadUrl(selectedPaths);
    link.download = t(`StoreIt-打包下载-${selectedPaths.length}项.zip`, `StoreIt-Archive-${selectedPaths.length}-items.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t(`正在打包下载已选的 ${selectedPaths.length} 个项目...`, `Downloading ${selectedPaths.length} selected items as ZIP...`), "info");
  };
  const handleDelete = item => {
    openConfirm({
      title: t(`确认删除${item.isDirectory ? "文件夹" : "文件"}`, `Confirm Delete ${item.isDirectory ? "Folder" : "File"}`),
      description: t(`确定要彻底删除 "${item.name}" 吗？此操作不可撤销！`, `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`),
      confirmText: t("彻底删除", "Delete"),
      destructive: true,
      onConfirm: () => deleteMutation.mutate(item.path)
    });
  };
  const handleBatchDelete = () => {
    if (selectedPaths.length === 0) return;
    openConfirm({
      title: t(`确认批量删除 (${selectedPaths.length} 项)`, `Confirm Batch Delete (${selectedPaths.length} items)`),
      description: t(`确定要彻底删除选中的 ${selectedPaths.length} 个文件或文件夹吗？此操作不可撤销！`, `Are you sure you want to permanently delete the ${selectedPaths.length} selected items? This action cannot be undone.`),
      confirmText: t("确认批量删除", "Delete All"),
      destructive: true,
      onConfirm: () => batchDeleteMutation.mutate(selectedPaths)
    });
  };
  const handleBatchFavorite = async () => {
    for (const p of selectedPaths) {
      try {
        await api.setFavorite(p, true);
      } catch {}
    }
    queryClient.invalidateQueries({
      queryKey: ["favoritesList"]
    });
    refetch();
    showToast(t(`已将 ${selectedPaths.length} 个项目加入收藏夹`, `Added ${selectedPaths.length} items to favorites`), "success");
    clearSelection();
  };
  const handleToggleFavorite = item => {
    favoriteMutation.mutate({
      path: item.path,
      favorite: !item.isFavorite
    });
  };
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(item);
    setContextMenu({
      x: Math.min(e.clientX, typeof window !== "undefined" ? window.innerWidth - 200 : e.clientX),
      y: Math.min(e.clientY, typeof window !== "undefined" ? window.innerHeight - 310 : e.clientY),
      item
    });
  };
  const rawItems = data || [];
  const items = useMemo(() => {
    const mapped = rawItems.map(it => ({
      ...it,
      isFavorite: viewMode === "favorites" ? true : favoritesSet.has(it.path)
    }));
    const dirFactor = sortOrder === "asc" ? 1 : -1;
    return mapped.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      if (sortBy === "size") {
        return ((a.size || 0) - (b.size || 0)) * dirFactor;
      }
      if (sortBy === "modifiedTime") {
        return (Number(a.modifiedTime || 0) - Number(b.modifiedTime || 0)) * dirFactor;
      }
      return a.name.localeCompare(b.name, locale === "en" ? "en-US" : "zh-CN", {
        numeric: true
      }) * dirFactor;
    });
  }, [rawItems, favoritesSet, viewMode, sortBy, sortOrder, locale]);
  const renderSortIcon = field => {
    if (sortBy !== field) return /*#__PURE__*/React.createElement(ArrowUpDown, {
      className: "w-3 h-3 opacity-40"
    });
    return sortOrder === "asc" ? /*#__PURE__*/React.createElement(ArrowUp, {
      className: "w-3 h-3 text-brand-primary"
    }) : /*#__PURE__*/React.createElement(ArrowDown, {
      className: "w-3 h-3 text-brand-primary"
    });
  };
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground gap-3"
    }, /*#__PURE__*/React.createElement(RefreshCw, {
      className: "w-8 h-8 animate-spin text-brand-secondary"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-sm"
    }, t("正在加载文件列表...", "Loading files...")));
  }
  if (isError) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex flex-col items-center justify-center p-12 text-destructive select-none gap-3"
    }, /*#__PURE__*/React.createElement(AlertCircle, {
      className: "w-10 h-10 text-destructive"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-base font-semibold"
    }, t("读取文件列表失败", "Failed to load file list")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-muted-foreground"
    }, error?.message || t("可能登录会话已过期或网络断开", "Your session may have expired or network is disconnected")), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => refetch(),
      className: "gap-1.5 mt-2"
    }, /*#__PURE__*/React.createElement(RefreshCw, {
      className: "w-3.5 h-3.5"
    }), " ", t("重新加载", "Reload")));
  }
  if (items.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "storeit-view-enter flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground select-none"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-20 h-20 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4 text-brand-secondary"
    }, /*#__PURE__*/React.createElement(FolderOpen, {
      className: "w-10 h-10"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-base font-semibold text-brand-primary"
    }, viewMode === "search" ? t("未找到匹配的文件", "No matching files found") : viewMode === "favorites" ? t("收藏夹暂无文件", "No favorite items yet") : viewMode === "recent" ? t("暂无最近访问记录", "No recently accessed files") : t("此目录下暂无文件", "This folder is empty")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-muted-foreground mt-1 max-w-sm text-center"
    }, viewMode === "files" ? t("直接将文件或文件夹拖拽至此，或点击右上角“上传 / 新建文件”开始添加", "Drag and drop files or folders here, or click 'Upload / New File' in the top bar") : t("可在我的文件中右键或点击星标将重要文件添加至此", "Right-click or star files in 'My Files' to add them here")));
  }
  const allSelected = items.length > 0 && selectedPaths.length === items.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "storeit-view-enter flex-1 overflow-y-auto p-4 relative min-h-full space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 px-1"
  }, selectedPaths.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "storeit-spring-bar flex flex-wrap items-center gap-2 bg-brand-primary text-white px-3.5 py-1.5 rounded-xl shadow-sm text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, t(`已选 ${selectedPaths.length} 项`, `${selectedPaths.length} selected`)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => allSelected ? clearSelection() : setSelectedPaths(items.map(it => it.path)),
    className: "px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 transition-colors"
  }, allSelected ? t("取消全选", "Deselect All") : t("全选当前页", "Select All")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleBatchDownload,
    className: "px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3.5 h-3.5"
  }), " ", t("打包下载", "Download ZIP")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setBatchMovePaths(selectedPaths),
    className: "px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
  }, /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-3.5 h-3.5"
  }), " ", t("批量移动", "Move")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => openBatchCopyModal(selectedPaths),
    className: "px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
  }, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5"
  }), " ", t("批量复制", "Copy")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleBatchFavorite,
    className: "px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
  }, /*#__PURE__*/React.createElement(Star, {
    className: "w-3.5 h-3.5"
  }), " ", t("批量收藏", "Favorite")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleBatchDelete,
    className: "px-2 py-0.5 rounded bg-rose-500/80 hover:bg-rose-500 flex items-center gap-1 transition-colors"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3.5 h-3.5"
  }), " ", t("批量删除", "Delete")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clearSelection,
    className: "p-0.5 rounded hover:bg-white/20 ml-1",
    title: t("退出多选", "Clear selection")
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-xs text-muted-foreground select-none"
  }, /*#__PURE__*/React.createElement("span", null, t(`共 ${items.length} 项`, `${items.length} items`)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSelectedPaths(items.map(it => it.path)),
    className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-foreground transition-colors"
  }, /*#__PURE__*/React.createElement(CheckSquare, {
    className: "w-3.5 h-3.5"
  }), " ", t("全选", "Select All")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: async () => {
      try {
        const res = await api.resyncFiles();
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["quota"]
        });
        showToast(t(`磁盘索引同步完成 (共扫描 ${res.indexed} 项)`, `Disk index synced (${res.indexed} items scanned)`), "success");
      } catch (err) {
        showToast(err.message || t("同步索引失败", "Failed to resync index"), "error");
      }
    },
    className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-foreground transition-colors",
    title: t("递归扫描物理存储目录并更新文件搜索索引", "Recursively scan physical storage directory and refresh search index")
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-3 h-3"
  }), " ", t("同步索引", "Sync Index"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs select-none"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground mr-1"
  }, t("排序:", "Sort:")), [{
    key: "name",
    label: t("名称", "Name")
  }, {
    key: "size",
    label: t("大小", "Size")
  }, {
    key: "modifiedTime",
    label: t("时间", "Modified")
  }].map(col => /*#__PURE__*/React.createElement("button", {
    key: col.key,
    type: "button",
    onClick: () => setSort(col.key),
    className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all duration-150 ${sortBy === col.key ? "bg-white shadow-sm text-brand-primary font-semibold" : "text-muted-foreground hover:bg-black/5 hover:text-foreground"}`
  }, /*#__PURE__*/React.createElement("span", null, col.label), renderSortIcon(col.key))))), layout === "grid" ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5"
  }, items.map((item, idx) => /*#__PURE__*/React.createElement(FileCard, {
    key: item.path,
    item: item,
    index: idx,
    onOpen: handleOpen,
    onDownload: handleDownload,
    onDelete: handleDelete,
    onToggleFavorite: handleToggleFavorite,
    onShare: it => setShareModalFile(it),
    onMove: it => setMoveModalFile(it),
    onCopy: it => openCopyModal(it),
    onRename: it => setRenameModalFile(it),
    onPreview: it => setPreviewFile(it),
    onContextMenu: handleContextMenu
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white/80 rounded-2xl border shadow-sm overflow-hidden"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 w-16"
  }), /*#__PURE__*/React.createElement("th", {
    onClick: () => setSort("name"),
    className: "py-2.5 px-3 cursor-pointer hover:text-brand-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, t("名称", "Name"), " ", renderSortIcon("name"))), /*#__PURE__*/React.createElement("th", {
    onClick: () => setSort("size"),
    className: "py-2.5 px-3 w-28 cursor-pointer hover:text-brand-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, t("大小", "Size"), " ", renderSortIcon("size"))), /*#__PURE__*/React.createElement("th", {
    onClick: () => setSort("modifiedTime"),
    className: "py-2.5 px-3 w-44 hidden sm:table-cell cursor-pointer hover:text-brand-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, t("修改时间", "Modified"), " ", renderSortIcon("modifiedTime"))), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 w-16 text-right"
  }, t("操作", "Actions")))), /*#__PURE__*/React.createElement("tbody", null, items.map((item, idx) => /*#__PURE__*/React.createElement(FileTableRow, {
    key: item.path,
    item: item,
    index: idx,
    onOpen: handleOpen,
    onDownload: handleDownload,
    onDelete: handleDelete,
    onToggleFavorite: handleToggleFavorite,
    onShare: it => setShareModalFile(it),
    onMove: it => setMoveModalFile(it),
    onCopy: it => openCopyModal(it),
    onRename: it => setRenameModalFile(it),
    onPreview: it => setPreviewFile(it),
    onContextMenu: handleContextMenu
  }))))), contextMenu && /*#__PURE__*/React.createElement("div", {
    style: {
      top: contextMenu.y,
      left: contextMenu.x
    },
    className: "storeit-menu-pop fixed z-50 w-52 bg-white/95 backdrop-blur-md rounded-2xl border shadow-xl p-1.5 text-xs select-none",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2.5 py-1.5 font-semibold text-foreground truncate border-b mb-1"
  }, contextMenu.item.name), !contextMenu.item.isDirectory && isPreviewable(contextMenu.item.name) && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPreviewFile(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("预览", "Preview")), !contextMenu.item.isDirectory && isEditableText(contextMenu.item.name) && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      openEditor(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("在线编辑", "Online Edit")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleDownload(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), contextMenu.item.isDirectory ? t("打包下载 (.zip)", "Download ZIP (.zip)") : t("下载", "Download")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShareModalFile(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), contextMenu.item.isDirectory ? t("共享文件夹 (R/RW)", "Share Folder (R/RW)") : t("分享", "Share")), viewMode !== "files" && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      openContainingFolder(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(FolderOpen, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("打开所在目录", "Open Containing Folder")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleToggleFavorite(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Star, {
    className: `w-3.5 h-3.5 ${contextMenu.item.isFavorite ? "fill-amber-500 text-amber-500" : ""}`
  }), contextMenu.item.isFavorite ? t("取消收藏", "Remove Favorite") : t("加入收藏", "Add to Favorites")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setRenameModalFile(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Edit2, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("重命名", "Rename")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMoveModalFile(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("移动到...", "Move to...")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      openCopyModal(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("复制到...", "Copy to...")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSelectedFile(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
  }, /*#__PURE__*/React.createElement(Info, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("属性与详情", "Properties")), /*#__PURE__*/React.createElement("div", {
    className: "h-px bg-black/5 my-1"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      handleDelete(contextMenu.item);
      setContextMenu(null);
    },
    className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-destructive/10 text-left text-destructive"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3.5 h-3.5"
  }), t("删除", "Delete"))));
}
function parseShareLinkInput(raw) {
  let input = (raw || "").trim();
  let extractedPassword = "";
  const qIdx = input.indexOf("?");
  if (qIdx >= 0) {
    const qs = new URLSearchParams(input.slice(qIdx + 1));
    extractedPassword = qs.get("key") || qs.get("password") || qs.get("pwd") || "";
    input = input.slice(0, qIdx);
  }
  if (input.startsWith("storeit+fed://")) {
    const rest = input.slice("storeit+fed://".length);
    const isLocal = rest.startsWith("localhost") || rest.startsWith("127.0.0.1");
    input = (isLocal ? "http://" : "https://") + rest;
  }
  let remoteServerUrl = "";
  let pathPart = input;
  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      const u = new URL(input);
      if (typeof window !== "undefined" && u.origin !== window.location.origin) {
        remoteServerUrl = u.origin;
      }
      pathPart = u.pathname + u.hash;
    } catch {}
  }
  let token = pathPart;
  if (token.includes("/api/fed/shares/")) {
    token = token.slice(token.indexOf("/api/fed/shares/") + "/api/fed/shares/".length);
  } else if (token.includes("#/s/")) {
    token = token.slice(token.indexOf("#/s/") + "#/s/".length);
  } else if (token.includes("/d/")) {
    token = token.slice(token.indexOf("/d/") + "/d/".length);
  }
  if (token.includes("/")) {
    token = token.slice(0, token.indexOf("/"));
  }
  token = token.replace(/[^A-Za-z0-9_-]/g, "");
  return {
    token,
    remoteServerUrl,
    extractedPassword
  };
}
function SharesTab() {
  const queryClient = useQueryClient();
  const showToast = useFileStore(s => s.showToast);
  const openConfirm = useFileStore(s => s.openConfirm);
  const activeShareToken = useFileStore(s => s.activeShareToken);
  const activeShareServerUrl = useFileStore(s => s.activeShareServerUrl);
  const activeSharePassword = useFileStore(s => s.activeSharePassword);
  const openSharedSpace = useFileStore(s => s.openSharedSpace);
  const closeSharedSpace = useFileStore(s => s.closeSharedSpace);
  const {
    locale,
    t
  } = useI18n();
  const [copiedId, setCopiedId] = useState(null);
  const [linkInput, setLinkInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [mountNameInput, setMountNameInput] = useState("");
  const [manifest, setManifest] = useState(null);
  const [subPath, setSubPath] = useState("");
  const [sharedItems, setSharedItems] = useState([]);
  const [loadingSpace, setLoadingSpace] = useState(false);
  const [spaceError, setSpaceError] = useState(null);
  const [needsPasswordPrompt, setNeedsPasswordPrompt] = useState(false);
  const [viewingSharedItem, setViewingSharedItem] = useState(null);
  const [sharedTextContent, setSharedTextContent] = useState("");
  const [editingSharedText, setEditingSharedText] = useState(false);
  const [savingSharedText, setSavingSharedText] = useState(false);
  const [sharedSplitMd, setSharedSplitMd] = useState(true);
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const [showMkdirBar, setShowMkdirBar] = useState(false);
  const [newSharedFileName, setNewSharedFileName] = useState("");
  const [showNewFileBar, setShowNewFileBar] = useState(false);
  const sharedUploadInputRef = useRef(null);
  const {
    data: sharesData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["shares"],
    queryFn: () => api.getShares()
  });
  const {
    data: mountsData,
    refetch: refetchMounts
  } = useQuery({
    queryKey: ["shareMounts"],
    queryFn: () => api.getShareMounts()
  });
  const loadActiveShareSpace = async (token, serverUrl, pwd, targetSubPath = "") => {
    if (!token) return;
    setLoadingSpace(true);
    setSpaceError(null);
    setNeedsPasswordPrompt(false);
    try {
      const mf = await api.getFederatedManifest(token, pwd, serverUrl);
      setManifest(mf);
      const listRes = await api.listFederatedShare(token, targetSubPath, pwd, serverUrl);
      setSharedItems(listRes.items || []);
      setSubPath(listRes.currentSubPath || "");
    } catch (err) {
      if (err?.passwordRequired || err?.status === 403) {
        setNeedsPasswordPrompt(true);
      }
      setSpaceError(err.message || t("无法加载共享空间", "Failed to load shared space"));
    } finally {
      setLoadingSpace(false);
    }
  };
  useEffect(() => {
    if (activeShareToken) {
      setViewingSharedItem(null);
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, "");
    } else {
      setManifest(null);
      setSharedItems([]);
      setSubPath("");
    }
  }, [activeShareToken, activeShareServerUrl, activeSharePassword]);
  const handleLoadInputShare = async saveAsMount => {
    const parsed = parseShareLinkInput(linkInput);
    if (!parsed.token) {
      showToast(t("请输入有效的分享链接、Token 或 storeit+fed:// 跨服协议地址", "Please enter a valid share link, token, or storeit+fed:// URI"), "error");
      return;
    }
    const pwd = passwordInput.trim() || parsed.extractedPassword;
    openSharedSpace(parsed.token, parsed.remoteServerUrl, pwd);
    if (saveAsMount) {
      try {
        let mf = null;
        try {
          mf = await api.getFederatedManifest(parsed.token, pwd, parsed.remoteServerUrl);
        } catch {}
        await api.createShareMount({
          shareLinkOrToken: linkInput.trim(),
          accessPassword: pwd || undefined,
          mountName: mountNameInput.trim() || mf?.name || undefined,
          permission: mf?.permission || "READ_WRITE",
          ownerName: mf?.ownerUsername || parsed.remoteServerUrl || "local",
          isDirectory: mf ? mf.isDirectory : true
        });
        refetchMounts();
        showToast(t("已保存到我的共享挂载列表", "Saved to mounted shares"), "success");
        setLinkInput("");
        setMountNameInput("");
      } catch (err) {
        showToast(err.message || t("保存挂载失败", "Failed to save mount"), "error");
      }
    }
  };
  const revokeMutation = useMutation({
    mutationFn: id => api.revokeShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shares"]
      });
      showToast(t("分享链接已撤销", "Share link revoked"), "success");
    },
    onError: err => showToast(err.message || t("撤销分享失败", "Failed to revoke share"), "error")
  });
  const deleteMountMutation = useMutation({
    mutationFn: id => api.deleteShareMount(id),
    onSuccess: () => {
      refetchMounts();
      showToast(t("已移除挂载项", "Mount removed"), "success");
    }
  });
  const handleCopy = async (key, text) => {
    if (await copyToClipboard(text)) {
      setCopiedId(key);
      showToast(t("已复制到剪贴板", "Copied to clipboard"), "success");
      setTimeout(() => setCopiedId(null), 1800);
    }
  };
  const handleRevoke = (id, filePath) => {
    openConfirm({
      title: t("确认撤销共享", "Confirm Revoke Share"),
      description: t(`确定要撤销对 "${filePath}" 的共享链接吗？撤销后所有访问与跨服挂载将立即失效。`, `Are you sure you want to revoke the share link for "${filePath}"? All web and federated mounts will stop working immediately.`),
      confirmText: t("确认撤销", "Revoke"),
      destructive: true,
      onConfirm: () => revokeMutation.mutate(id)
    });
  };
  const fedBase = activeShareServerUrl ? activeShareServerUrl.replace(/\/+$/, "") : "";
  const pwdQuery = activeSharePassword ? `&password=${encodeURIComponent(activeSharePassword)}` : "";
  const getSharedPreviewUrl = itemSubPath => `${fedBase}/api/fed/shares/${encodeURIComponent(activeShareToken || "")}/preview?subPath=${encodeURIComponent(itemSubPath)}${pwdQuery}`;
  const getSharedDownloadUrl = itemSubPath => `${fedBase}/api/fed/shares/${encodeURIComponent(activeShareToken || "")}/download?subPath=${encodeURIComponent(itemSubPath)}${pwdQuery}`;
  const getSharedZipUrl = targetSubPath => `${fedBase}/api/fed/shares/${encodeURIComponent(activeShareToken || "")}/zip?subPath=${encodeURIComponent(targetSubPath)}${pwdQuery}`;
  const handleOpenSharedItem = async it => {
    if (!activeShareToken) return;
    if (it.isDirectory) {
      setViewingSharedItem(null);
      await loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, it.path);
      return;
    }
    setViewingSharedItem(it);
    setEditingSharedText(false);
    if (getPreviewKind(it.name) === "text") {
      try {
        const res = await api.getFederatedFileContent(activeShareToken, it.path, activeSharePassword, activeShareServerUrl);
        setSharedTextContent(res.content || "");
      } catch (err) {
        showToast(err.message || t("读取共享文件内容失败", "Failed to read shared file"), "error");
      }
    }
  };
  const handleSaveSharedText = async () => {
    if (!activeShareToken || !viewingSharedItem) return;
    setSavingSharedText(true);
    try {
      await api.saveFederatedFileContent(activeShareToken, viewingSharedItem.path, sharedTextContent, activeSharePassword, activeShareServerUrl);
      setEditingSharedText(false);
      showToast(t("共享文件内容已保存", "Shared file saved"), "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err) {
      showToast(err.message || t("保存共享文件失败", "Failed to save shared file"), "error");
    } finally {
      setSavingSharedText(false);
    }
  };
  const handleSharedUpload = async e => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeShareToken) return;
    for (let i = 0; i < files.length; i++) {
      try {
        await api.uploadToFederatedShare(activeShareToken, subPath, files[i], "rename", activeSharePassword, activeShareServerUrl);
      } catch (err) {
        showToast(err.message || t(`上传 ${files[i].name} 失败`, `Failed to upload ${files[i].name}`), "error");
      }
    }
    e.target.value = "";
    showToast(t("文件已上传至共享目录", "Files uploaded to shared folder"), "success");
    loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
  };
  const handleCreateSharedSubfolder = async e => {
    e.preventDefault();
    if (!activeShareToken || !newSubfolderName.trim()) return;
    try {
      await api.createFederatedSubfolder(activeShareToken, subPath, newSubfolderName.trim(), activeSharePassword, activeShareServerUrl);
      setNewSubfolderName("");
      setShowMkdirBar(false);
      showToast(t("共享子文件夹已创建", "Subfolder created"), "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err) {
      showToast(err.message || t("创建子文件夹失败", "Failed to create subfolder"), "error");
    }
  };
  const handleCreateSharedBlankFile = async e => {
    e.preventDefault();
    if (!activeShareToken || !newSharedFileName.trim()) return;
    try {
      const name = newSharedFileName.trim();
      const initial = name.endsWith(".md") ? `# ${name}\n\n` : "";
      const res = await api.createFederatedBlankFile(activeShareToken, subPath, name, initial, activeSharePassword, activeShareServerUrl);
      setNewSharedFileName("");
      setShowNewFileBar(false);
      showToast(t("共享文件已创建", "Shared file created"), "success");
      await loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
      if (res.file) {
        setViewingSharedItem({
          name: res.file.name,
          path: res.file.path,
          isDirectory: false,
          size: res.file.size
        });
        setSharedTextContent(initial);
        setEditingSharedText(true);
      }
    } catch (err) {
      showToast(err.message || t("创建共享文件失败", "Failed to create shared file"), "error");
    }
  };
  const handleDeleteSharedItem = async it => {
    if (!activeShareToken) return;
    try {
      await api.deleteFederatedItem(activeShareToken, it.path, activeSharePassword, activeShareServerUrl);
      if (viewingSharedItem?.path === it.path) setViewingSharedItem(null);
      showToast(t(`已从共享目录删除 "${it.name}"`, `Deleted "${it.name}" from shared folder`), "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err) {
      showToast(err.message || t("删除失败", "Failed to delete"), "error");
    }
  };
  const shares = sharesData || [];
  const mounts = mountsData || [];
  const isRW = manifest?.permission === "READ_WRITE";
  const subParts = subPath ? subPath.split("/").filter(Boolean) : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-5xl mx-auto space-y-6 storeit-view-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 pb-4 border-b"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-6 h-6 text-brand-secondary"
  }), t("共享文件夹 · 跨服联邦挂载与分享中心", "Shared Folders · Cross-Server Federation & Shares")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mt-1"
  }, t("管理单文件与文件夹共享（支持 R 只读 / RW 读写权限管控），或通过 SFSP/1.0 协议加载本机及跨服务器共享空间", "Manage file & folder shares (with R read-only / RW read-write permissions) or mount local & remote shared spaces via SFSP/1.0"))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => {
      refetch();
      refetchMounts();
      if (activeShareToken) {
        loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
      }
    },
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-4 h-4"
  }), " ", t("刷新全部", "Refresh All"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Globe, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("加载共享链接 / 跨服联邦挂载 (SFSP/1.0)", "Open Share Link / Mount Federated Space (SFSP/1.0)")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mt-0.5"
  }, t("支持粘贴本机分享 Token、Web 链接（", "Paste a share token, web URL ("), /*#__PURE__*/React.createElement("code", {
    className: "bg-muted px-1 rounded"
  }, "/#/s/TOKEN"), t("）或任意远程 StoreIt 节点协议地址（", "), or remote StoreIt federation URI ("), /*#__PURE__*/React.createElement("code", {
    className: "bg-muted px-1 rounded"
  }, "storeit+fed://host/api/fed/shares/TOKEN"), t("）", ")")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("分享链接 / Token / 跨服协议 URI", "Share Link / Token / Federation URI")), /*#__PURE__*/React.createElement(Input, {
    value: linkInput,
    onChange: e => setLinkInput(e.target.value),
    placeholder: t("粘贴 #/s/... 或 storeit+fed://...", "Paste #/s/... or storeit+fed://..."),
    className: "text-xs font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("提取码 (若设置)", "Access Code")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: passwordInput,
    onChange: e => setPasswordInput(e.target.value),
    placeholder: t("可选提取码", "Optional"),
    className: "text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("挂载备注名 (可选)", "Alias (Optional)")), /*#__PURE__*/React.createElement(Input, {
    value: mountNameInput,
    onChange: e => setMountNameInput(e.target.value),
    placeholder: t("如：团队设计库", "e.g. Team Assets"),
    className: "text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-3 flex gap-1.5"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    onClick: () => handleLoadInputShare(false),
    className: "flex-1 text-xs"
  }, t("立即打开", "Open Now")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => handleLoadInputShare(true),
    className: "flex-1 text-xs"
  }, t("保存并挂载", "Save & Mount")))), mounts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-muted-foreground"
  }, t(`已保存的共享挂载 (${mounts.length})：`, `Saved Mounts (${mounts.length}):`)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5"
  }, mounts.map(m => {
    const isActive = activeShareToken === m.shareToken && (activeShareServerUrl || "") === (m.remoteServerUrl || "");
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      onClick: () => openSharedSpace(m.shareToken, m.remoteServerUrl || "", m.accessPassword || ""),
      className: `p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${isActive ? "border-brand-primary bg-brand-primary/10 shadow-sm" : "bg-muted/20 hover:bg-white"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 min-w-0"
    }, /*#__PURE__*/React.createElement(FolderOpen, {
      className: "w-5 h-5 text-amber-500 shrink-0"
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-brand-primary truncate"
    }, m.mountName), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 text-[10px] text-muted-foreground"
    }, /*#__PURE__*/React.createElement("span", {
      className: `px-1.5 py-0.2 rounded font-semibold ${m.permission === "READ_WRITE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`
    }, m.permission === "READ_WRITE" ? t("RW 读写", "RW") : t("R 只读", "R")), /*#__PURE__*/React.createElement("span", {
      className: "truncate"
    }, m.remoteServerUrl ? `${t("跨服", "Remote")}: ${m.remoteServerUrl}` : `${t("来自", "From")}: ${m.ownerName || t("本机", "Local")}`)))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: e => {
        e.stopPropagation();
        deleteMountMutation.mutate(m.id);
      },
      className: "p-1 text-muted-foreground hover:text-destructive rounded",
      title: t("移除挂载", "Remove mount")
    }, /*#__PURE__*/React.createElement(Trash2, {
      className: "w-3.5 h-3.5"
    })));
  })))), activeShareToken && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border-2 border-brand-primary/30 shadow-md overflow-hidden storeit-modal-spring"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-brand-primary/5 border-b flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 min-w-0"
  }, /*#__PURE__*/React.createElement(FolderOpen, {
    className: "w-5 h-5 text-amber-500 shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-brand-primary truncate"
  }, manifest?.name || `${t("共享空间", "Shared Space")} (${activeShareToken})`), manifest && /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] px-2 py-0.5 rounded-full font-semibold ${isRW ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-blue-100 text-blue-800 border border-blue-300"}`
  }, isRW ? t("RW 可读写协同", "RW Read & Write") : t("R 只读访问", "R Read-Only")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground"
  }, activeShareServerUrl ? `${t("SFSP 跨服节点", "SFSP Remote Node")}: ${activeShareServerUrl}` : t("SFSP/1.0 本机节点", "SFSP/1.0 Local Node"))), manifest && /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground mt-0.5"
  }, t(`所有者: ${manifest.ownerUsername} · 已下载 ${manifest.downloads} 次`, `Owner: ${manifest.ownerUsername} · ${manifest.downloads} downloads`)))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1.5"
  }, manifest && isRW && manifest.isDirectory && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: sharedUploadInputRef,
    type: "file",
    multiple: true,
    className: "hidden",
    onChange: handleSharedUpload
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "default",
    className: "h-8 text-xs gap-1",
    onClick: () => sharedUploadInputRef.current?.click()
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-3.5 h-3.5"
  }), " ", t("上传文件", "Upload")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 text-xs gap-1",
    onClick: () => {
      setShowNewFileBar(v => !v);
      setShowMkdirBar(false);
    }
  }, /*#__PURE__*/React.createElement(FilePlus2, {
    className: "w-3.5 h-3.5"
  }), " ", t("新建文件", "New File")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 text-xs gap-1",
    onClick: () => {
      setShowMkdirBar(v => !v);
      setShowNewFileBar(false);
    }
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-3.5 h-3.5 text-amber-500"
  }), t("新建子目录", "New Subfolder"))), manifest && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 text-xs gap-1",
    onClick: () => {
      const a = document.createElement("a");
      a.href = getSharedZipUrl(subPath);
      a.download = `${manifest.name || "Shared"}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3.5 h-3.5"
  }), " ", t("打包下载 (.zip)", "Download ZIP")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-8 text-xs gap-1",
    onClick: closeSharedSpace
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  }), " ", t("关闭共享视图", "Close")))), manifest?.isDirectory && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2 bg-muted/20 border-b flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setViewingSharedItem(null);
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, "");
    },
    className: "inline-flex items-center gap-1 hover:text-brand-primary font-medium"
  }, /*#__PURE__*/React.createElement(Home, {
    className: "w-3.5 h-3.5"
  }), " ", t("共享根目录", "Shared Root")), subParts.map((part, idx) => {
    const targetSub = subParts.slice(0, idx + 1).join("/");
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: targetSub
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      className: "w-3 h-3 opacity-40"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        setViewingSharedItem(null);
        loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, targetSub);
      },
      className: "hover:text-brand-primary font-medium"
    }, part));
  })), showMkdirBar && /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreateSharedSubfolder,
    className: "px-4 py-2.5 bg-amber-50/60 border-b flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-4 h-4 text-amber-500 shrink-0"
  }), /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: newSubfolderName,
    onChange: e => setNewSubfolderName(e.target.value),
    placeholder: t("输入新子文件夹名称...", "Enter new subfolder name..."),
    className: "h-8 text-xs max-w-xs"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "sm",
    className: "h-8 text-xs"
  }, t("创建", "Create")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    size: "sm",
    variant: "ghost",
    className: "h-8 text-xs",
    onClick: () => setShowMkdirBar(false)
  }, t("取消", "Cancel"))), showNewFileBar && /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreateSharedBlankFile,
    className: "px-4 py-2.5 bg-blue-50/60 border-b flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(FilePlus2, {
    className: "w-4 h-4 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: newSharedFileName,
    onChange: e => setNewSharedFileName(e.target.value),
    placeholder: t("输入新文件名称 (如 README.md 或 notes.txt)...", "Enter file name (e.g. README.md or notes.txt)..."),
    className: "h-8 text-xs max-w-xs"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "sm",
    className: "h-8 text-xs"
  }, t("创建并编辑", "Create & Edit")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    size: "sm",
    variant: "ghost",
    className: "h-8 text-xs",
    onClick: () => setShowNewFileBar(false)
  }, t("取消", "Cancel"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, loadingSpace ? /*#__PURE__*/React.createElement("div", {
    className: "py-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-4 h-4 animate-spin text-brand-secondary"
  }), t("正在通过 SFSP 协议同步共享目录...", "Syncing shared folder via SFSP...")) : spaceError ? /*#__PURE__*/React.createElement("div", {
    className: "py-8 max-w-md mx-auto text-center space-y-3"
  }, /*#__PURE__*/React.createElement(Lock, {
    className: "w-8 h-8 text-amber-500 mx-auto"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold text-foreground"
  }, spaceError), needsPasswordPrompt && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 justify-center"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: passwordInput,
    onChange: e => setPasswordInput(e.target.value),
    placeholder: t("请输入该共享的访问提取码", "Enter access code"),
    className: "max-w-[200px] h-8 text-xs"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    className: "h-8 text-xs",
    onClick: () => openSharedSpace(activeShareToken, activeShareServerUrl, passwordInput.trim())
  }, t("验证提取码", "Unlock")))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, sharedItems.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-10 text-center text-xs text-muted-foreground"
  }, t("此共享目录下暂无文件", "This shared folder is empty"), isRW && t("（可点击右上角“上传文件”或“新建文件”添加内容）", " (use 'Upload' or 'New File' above to add content)")) : /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto border rounded-xl"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b bg-muted/40 text-muted-foreground"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("名称", "Name")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold w-28"
  }, t("大小", "Size")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold w-40 hidden sm:table-cell"
  }, t("修改时间", "Modified")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold text-right"
  }, t("操作", "Actions")))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y"
  }, sharedItems.map(it => /*#__PURE__*/React.createElement("tr", {
    key: it.path || it.name,
    onDoubleClick: () => handleOpenSharedItem(it),
    className: "hover:bg-muted/20 cursor-pointer"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, it.isDirectory ? /*#__PURE__*/React.createElement(Folder, {
    className: "w-4 h-4 text-amber-500 shrink-0"
  }) : /*#__PURE__*/React.createElement(FileText, {
    className: "w-4 h-4 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => handleOpenSharedItem(it),
    className: "font-medium text-foreground hover:text-brand-primary"
  }, it.name))), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-muted-foreground"
  }, it.isDirectory ? t("文件夹", "Folder") : formatBytes(it.size || 0)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-muted-foreground hidden sm:table-cell"
  }, formatDate(it.modifiedTime, locale)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-right whitespace-nowrap space-x-1"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 px-2 text-xs gap-1",
    onClick: () => handleOpenSharedItem(it)
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), it.isDirectory ? t("进入", "Open") : t("查看", "View")), !it.isDirectory && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 px-2 text-xs gap-1",
    asChild: true
  }, /*#__PURE__*/React.createElement("a", {
    href: getSharedDownloadUrl(it.path),
    download: it.name
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("下载", "Download"))), isRW && manifest?.isDirectory && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 px-2 text-xs text-destructive hover:text-destructive",
    onClick: () => handleDeleteSharedItem(it)
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3.5 h-3.5"
  })))))))), viewingSharedItem && !viewingSharedItem.isDirectory && /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl border bg-muted/10 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 border-b pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(FileText, {
    className: "w-4 h-4 text-brand-secondary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-sm text-brand-primary"
  }, viewingSharedItem.name), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-muted-foreground"
  }, "(", formatBytes(viewingSharedItem.size || 0), ")")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, getPreviewKind(viewingSharedItem.name) === "text" && isRW && /*#__PURE__*/React.createElement(React.Fragment, null, editingSharedText ? /*#__PURE__*/React.createElement(React.Fragment, null, ["md", "markdown"].includes(getFileExtension(viewingSharedItem.name)) && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setSharedSplitMd(v => !v)
  }, /*#__PURE__*/React.createElement(Columns, {
    className: "w-3 h-3"
  }), sharedSplitMd ? t("分栏预览", "Split View") : t("纯源码", "Source Only")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    className: "h-7 text-xs gap-1",
    disabled: savingSharedText,
    onClick: handleSaveSharedText
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-3 h-3"
  }), savingSharedText ? t("保存中...", "Saving...") : t("保存修改", "Save")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs",
    onClick: () => setEditingSharedText(false)
  }, t("取消", "Cancel"))) : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-7 text-xs gap-1",
    onClick: () => setEditingSharedText(true)
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("在线协同编辑", "Collaborate & Edit"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 text-xs",
    onClick: () => setViewingSharedItem(null)
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  })))), getPreviewKind(viewingSharedItem.name) === "image" ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center p-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: getSharedPreviewUrl(viewingSharedItem.path),
    alt: viewingSharedItem.name,
    className: "max-h-96 rounded-xl shadow-sm object-contain"
  })) : getPreviewKind(viewingSharedItem.name) === "video" ? /*#__PURE__*/React.createElement("video", {
    src: getSharedPreviewUrl(viewingSharedItem.path),
    controls: true,
    className: "max-h-96 w-full rounded-xl bg-black"
  }) : getPreviewKind(viewingSharedItem.name) === "audio" ? /*#__PURE__*/React.createElement("audio", {
    src: getSharedPreviewUrl(viewingSharedItem.path),
    controls: true,
    className: "w-full"
  }) : getPreviewKind(viewingSharedItem.name) === "pdf" ? /*#__PURE__*/React.createElement("iframe", {
    src: getSharedPreviewUrl(viewingSharedItem.path),
    className: "w-full h-96 rounded-xl border bg-white",
    title: viewingSharedItem.name
  }) : editingSharedText ? ["md", "markdown"].includes(getFileExtension(viewingSharedItem.name)) && sharedSplitMd ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3 h-80"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: sharedTextContent,
    onChange: e => setSharedTextContent(e.target.value),
    className: "w-full h-full p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs outline-none resize-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full p-3 rounded-xl bg-white border overflow-auto"
  }, /*#__PURE__*/React.createElement(MarkdownRenderer, {
    content: sharedTextContent,
    showToc: false
  }))) : /*#__PURE__*/React.createElement("textarea", {
    value: sharedTextContent,
    onChange: e => setSharedTextContent(e.target.value),
    className: "w-full h-72 p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs outline-none resize-none"
  }) : ["md", "markdown"].includes(getFileExtension(viewingSharedItem.name)) ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-white border max-h-96 overflow-auto"
  }, /*#__PURE__*/React.createElement(MarkdownRenderer, {
    content: sharedTextContent
  })) : /*#__PURE__*/React.createElement("pre", {
    className: "p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs max-h-80 overflow-auto whitespace-pre-wrap"
  }, sharedTextContent))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(ShieldCheck, {
    className: "w-4 h-4 text-brand-secondary"
  }), t(`我发起的共享与外链 (${shares.length})`, `My Created Shares (${shares.length})`)), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 text-muted-foreground flex flex-col items-center gap-3"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-6 h-6 animate-spin text-brand-secondary"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs"
  }, t("正在读取分享列表...", "Loading shares..."))) : shares.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 bg-white/60 rounded-2xl border border-dashed text-muted-foreground"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-10 h-10 mx-auto mb-2 opacity-30 text-brand-secondary"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-brand-primary text-sm"
  }, t("还没有发起过共享", "No active shares yet")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mt-1"
  }, t("在“我的文件”中右键任意文件夹或文件并点击“分享”，即可创建只读或 RW 读写协同共享", "Right-click any file or folder in 'My Files' and choose 'Share' to create a R or RW share"))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, shares.map(item => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const host = typeof window !== "undefined" ? window.location.host : "localhost:59898";
    const webSpaceUrl = `${origin}/#/s/${item.token}`;
    const directUrl = `${origin}${item.url}`;
    const fedUri = `storeit+fed://${host}/api/fed/shares/${item.token}`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: "p-4 bg-white/80 hover:bg-white rounded-2xl border shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2 min-w-0 flex-1 w-full"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, item.isDirectory ? /*#__PURE__*/React.createElement(Folder, {
      className: "w-4 h-4 text-amber-500 shrink-0"
    }) : /*#__PURE__*/React.createElement(FileText, {
      className: "w-4 h-4 text-brand-secondary shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-sm text-foreground truncate max-w-md",
      title: item.filePath
    }, item.title || item.filePath), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
    }, item.isDirectory ? t("共享文件夹", "Shared Folder") : t("单文件", "Single File")), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.permission === "READ_WRITE" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`
    }, item.permission === "READ_WRITE" ? t("RW 可读写", "RW Read/Write") : t("R 只读", "R Read-Only")), item.passwordProtected && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5"
    }, /*#__PURE__*/React.createElement(Lock, {
      className: "w-2.5 h-2.5"
    }), " ", t("含提取码", "Protected"))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      readOnly: true,
      value: webSpaceUrl,
      className: "w-full sm:w-80 text-xs font-mono bg-muted/50 border rounded-lg px-2.5 py-1 text-muted-foreground outline-none select-all",
      onClick: e => e.target.select()
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      className: "h-7 px-2.5 text-xs gap-1",
      onClick: () => handleCopy(`web_${item.id}`, webSpaceUrl)
    }, copiedId === `web_${item.id}` ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      className: "w-3 h-3 text-emerald-600"
    }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
      className: "w-3 h-3"
    }), " ", t("互动链接", "Web Link"))), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      className: "h-7 px-2.5 text-xs gap-1",
      onClick: () => handleCopy(`dl_${item.id}`, directUrl)
    }, copiedId === `dl_${item.id}` ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      className: "w-3 h-3 text-emerald-600"
    }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
      className: "w-3 h-3"
    }), " ", t("下载直链", "Direct URL"))), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      className: "h-7 px-2.5 text-xs gap-1",
      onClick: () => handleCopy(`fed_${item.id}`, fedUri)
    }, copiedId === `fed_${item.id}` ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      className: "w-3 h-3 text-emerald-600"
    }), " ", t("已复制协议", "Copied URI")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Globe, {
      className: "w-3 h-3 text-brand-secondary"
    }), t("跨服 URI", "SFSP URI")))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
    }, /*#__PURE__*/React.createElement("span", null, t("路径", "Path"), ": /", item.filePath), /*#__PURE__*/React.createElement("span", null, t("下载次数", "Downloads"), ":", " ", /*#__PURE__*/React.createElement("strong", {
      className: "text-foreground"
    }, item.downloads || 0, " /", " ", item.maxDownloads ? item.maxDownloads : t("不限", "Unlimited"))), /*#__PURE__*/React.createElement("span", null, t("有效期至", "Expires"), ":", " ", /*#__PURE__*/React.createElement("strong", {
      className: "text-foreground"
    }, item.expiry ? formatDate(item.expiry, locale) : t("永久有效", "Never"))))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 shrink-0"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      className: "text-xs h-8",
      onClick: () => openSharedSpace(item.token, "", "")
    }, t("打开共享空间", "Open Space")), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      size: "sm",
      className: "gap-1 h-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-0 shadow-none",
      onClick: () => handleRevoke(item.id, item.filePath)
    }, /*#__PURE__*/React.createElement(Trash2, {
      className: "w-3.5 h-3.5"
    }), " ", t("撤销", "Revoke"))));
  }))));
}
const UNIT_MULTIPLIER = {
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024
};
function bytesToUnitValue(bytes) {
  if (!bytes || bytes <= 0) return {
    value: 10,
    unit: "unlimited"
  };
  if (bytes % UNIT_MULTIPLIER.TB === 0) return {
    value: bytes / UNIT_MULTIPLIER.TB,
    unit: "TB"
  };
  if (bytes % UNIT_MULTIPLIER.GB === 0) return {
    value: bytes / UNIT_MULTIPLIER.GB,
    unit: "GB"
  };
  return {
    value: Math.max(1, Math.round(bytes / UNIT_MULTIPLIER.MB)),
    unit: "MB"
  };
}
function unitValueToBytes(value, unit) {
  if (unit === "unlimited") return 0;
  const num = Math.max(1, Number(value) || 1);
  return Math.round(num * UNIT_MULTIPLIER[unit]);
}
function UserManagementTab() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(s => s.user);
  const {
    locale,
    t
  } = useI18n();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newQuotaVal, setNewQuotaVal] = useState(10);
  const [newQuotaUnit, setNewQuotaUnit] = useState("unlimited");
  const [newMustChange, setNewMustChange] = useState(false);
  const [customInviteCode, setCustomInviteCode] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState("1");
  const [inviteExpireHours, setInviteExpireHours] = useState("168");
  const [inviteQuotaVal, setInviteQuotaVal] = useState(10);
  const [inviteQuotaUnit, setInviteQuotaUnit] = useState("GB");
  const [inviteNote, setInviteNote] = useState("");
  const [copiedInviteId, setCopiedInviteId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.getAdminUsers()
  });
  const {
    data: invitesData,
    isLoading: loadingInvites,
    refetch: refetchInvites
  } = useQuery({
    queryKey: ["adminInvites"],
    queryFn: () => api.getAdminInvites()
  });
  const createMutation = useMutation({
    mutationFn: payload => api.createAdminUser(payload),
    onSuccess: () => {
      setFeedback({
        text: t("用户创建成功", "User created successfully"),
        type: "success"
      });
      setNewUsername("");
      setNewPassword("");
      setNewQuotaVal(10);
      setNewQuotaUnit("unlimited");
      setNewMustChange(false);
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"]
      });
    },
    onError: err => {
      setFeedback({
        text: err.message || t("创建用户失败", "Failed to create user"),
        type: "error"
      });
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      username,
      quota,
      role,
      enabled
    }) => api.updateAdminUser(username, {
      storageQuota: quota,
      role,
      enabled
    }),
    onSuccess: () => {
      setFeedback({
        text: t("用户属性已保存", "User attributes saved"),
        type: "success"
      });
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"]
      });
    },
    onError: err => {
      setFeedback({
        text: err.message || t("保存失败", "Failed to save"),
        type: "error"
      });
    }
  });
  const resetPasswordMutation = useMutation({
    mutationFn: ({
      username,
      password,
      mustChangePassword
    }) => api.resetAdminUserPassword(username, password, mustChangePassword),
    onSuccess: () => {
      setFeedback({
        text: t("用户口令已重置", "User password reset"),
        type: "success"
      });
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"]
      });
    },
    onError: err => {
      setFeedback({
        text: err.message || t("口令重置失败", "Failed to reset password"),
        type: "error"
      });
    }
  });
  const createInviteMutation = useMutation({
    mutationFn: () => {
      const quotaBytes = unitValueToBytes(inviteQuotaVal, inviteQuotaUnit);
      return api.createAdminInvite({
        code: customInviteCode.trim() || undefined,
        maxUses: parseInt(inviteMaxUses, 10) || 0,
        expireHours: parseInt(inviteExpireHours, 10),
        defaultQuota: quotaBytes,
        note: inviteNote.trim()
      });
    },
    onSuccess: res => {
      setFeedback({
        text: t(`邀请码 ${res.data.code} 已生成`, `Invite code ${res.data.code} generated`),
        type: "success"
      });
      setCustomInviteCode("");
      setInviteNote("");
      queryClient.invalidateQueries({
        queryKey: ["adminInvites"]
      });
    },
    onError: err => {
      setFeedback({
        text: err.message || t("生成邀请码失败", "Failed to generate invite code"),
        type: "error"
      });
    }
  });
  const deleteInviteMutation = useMutation({
    mutationFn: id => api.deleteAdminInvite(id),
    onSuccess: () => {
      setFeedback({
        text: t("邀请码已删除", "Invite code deleted"),
        type: "success"
      });
      queryClient.invalidateQueries({
        queryKey: ["adminInvites"]
      });
    },
    onError: err => {
      setFeedback({
        text: err.message || t("删除邀请码失败", "Failed to delete invite code"),
        type: "error"
      });
    }
  });
  const handleCreate = e => {
    e.preventDefault();
    if (!newUsername.trim() || newPassword.length < 8) {
      setFeedback({
        text: t("用户名不能为空，口令至少 8 位", "Username is required and password must be at least 8 characters"),
        type: "error"
      });
      return;
    }
    const bytes = unitValueToBytes(newQuotaVal, newQuotaUnit);
    createMutation.mutate({
      username: newUsername.trim(),
      password: newPassword,
      storageQuota: bytes,
      mustChangePassword: newMustChange
    });
  };
  const handleCopyInvite = async (key, text) => {
    if (await copyToClipboard(text)) {
      setCopiedInviteId(key);
      setTimeout(() => setCopiedInviteId(null), 1800);
    }
  };
  const users = data || [];
  const invites = invitesData || [];
  const computedNewBytes = unitValueToBytes(newQuotaVal, newQuotaUnit);
  const computedInviteBytes = unitValueToBytes(inviteQuotaVal, inviteQuotaUnit);
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-4 border-b"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "w-6 h-6 text-brand-secondary"
  }), t("系统用户与受邀注册管理", "User & Invited Registration Management")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mt-1"
  }, t("管理用户配额与状态、生成自助注册邀请码或重置用户口令", "Manage user storage quotas & status, generate invitation codes, or reset passwords"))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => {
      refetch();
      refetchInvites();
    },
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-4 h-4"
  }), " ", t("刷新", "Refresh"))), feedback && /*#__PURE__*/React.createElement("div", {
    className: `p-3.5 rounded-xl flex items-center gap-2.5 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`
  }, feedback.type === "success" ? /*#__PURE__*/React.createElement(CheckCircle2, {
    className: "w-4 h-4 text-emerald-600 shrink-0"
  }) : /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-4 h-4 text-destructive shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, feedback.text)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Ticket, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("自主受邀注册 · 邀请码生成与管理", "Invited Registration · Invitation Codes")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mt-0.5"
  }, t("生成邀请码或专属注册直链，新用户可在登录页切换至“受邀注册”自助开户并自动分配预设配额", "Generate invite codes or direct registration links so new users can sign up with preset storage quotas")))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      createInviteMutation.mutate();
    },
    className: "grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("自定义邀请码 (留空随机生成)", "Custom Code (blank = random)")), /*#__PURE__*/React.createElement(Input, {
    value: customInviteCode,
    onChange: e => setCustomInviteCode(e.target.value),
    placeholder: t("如 ST-TEAM-2026", "e.g. ST-TEAM-2026"),
    className: "font-mono text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("可用次数", "Max Uses")), /*#__PURE__*/React.createElement("select", {
    value: inviteMaxUses,
    onChange: e => setInviteMaxUses(e.target.value),
    className: "w-full h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, t("1 次 (单人专属)", "1 use (Single)")), /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, t("5 次", "5 uses")), /*#__PURE__*/React.createElement("option", {
    value: "10"
  }, t("10 次", "10 uses")), /*#__PURE__*/React.createElement("option", {
    value: "50"
  }, t("50 次", "50 uses")), /*#__PURE__*/React.createElement("option", {
    value: "0"
  }, t("不限次数", "Unlimited")))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("有效期", "Expiration")), /*#__PURE__*/React.createElement("select", {
    value: inviteExpireHours,
    onChange: e => setInviteExpireHours(e.target.value),
    className: "w-full h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "24"
  }, t("1 天", "1 Day")), /*#__PURE__*/React.createElement("option", {
    value: "168"
  }, t("7 天", "7 Days")), /*#__PURE__*/React.createElement("option", {
    value: "720"
  }, t("30 天", "30 Days")), /*#__PURE__*/React.createElement("option", {
    value: "-1"
  }, t("永久有效", "Never Expire")))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("注册初始配额", "Default Quota"), " (", computedInviteBytes === 0 ? t("不限额", "Unlimited") : formatBytes(computedInviteBytes), ")"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, inviteQuotaUnit !== "unlimited" && /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "1",
    value: inviteQuotaVal,
    onChange: e => setInviteQuotaVal(Math.max(1, Number(e.target.value))),
    className: "w-16 text-xs"
  }), /*#__PURE__*/React.createElement("select", {
    value: inviteQuotaUnit,
    onChange: e => setInviteQuotaUnit(e.target.value),
    className: "flex-1 h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "unlimited"
  }, t("不限额", "Unlimited")), /*#__PURE__*/React.createElement("option", {
    value: "MB"
  }, "MB"), /*#__PURE__*/React.createElement("option", {
    value: "GB"
  }, "GB"), /*#__PURE__*/React.createElement("option", {
    value: "TB"
  }, "TB")))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: createInviteMutation.isPending,
    className: "w-full gap-1.5"
  }, /*#__PURE__*/React.createElement(Ticket, {
    className: "w-4 h-4"
  }), " ", t("生成邀请码", "Generate"))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-12"
  }, /*#__PURE__*/React.createElement(Input, {
    value: inviteNote,
    onChange: e => setInviteNote(e.target.value),
    placeholder: t("可选备注说明（例如：研发组新成员邀请、活动临时账号等）", "Optional note (e.g. R&D team onboarding, guest account, etc.)"),
    className: "h-8 text-xs"
  }))), loadingInvites ? /*#__PURE__*/React.createElement("div", {
    className: "py-4 text-center text-xs text-muted-foreground"
  }, t("正在加载邀请码...", "Loading invitation codes...")) : invites.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed"
  }, t("暂无邀请码，点击上方“生成邀请码”即可创建受邀注册凭证", "No invitation codes yet. Click 'Generate' above to create one.")) : /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto border rounded-xl"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b bg-muted/40 text-muted-foreground"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("邀请码", "Code")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("已用 / 上限", "Used / Max")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("预设配额", "Default Quota")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("有效期至", "Expires")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold"
  }, t("备注", "Note")), /*#__PURE__*/React.createElement("th", {
    className: "py-2 px-3 font-semibold text-right"
  }, t("操作", "Actions")))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y"
  }, invites.map(inv => {
    const registerLink = typeof window !== "undefined" ? `${window.location.origin}/login?invite=${encodeURIComponent(inv.code)}` : `/login?invite=${encodeURIComponent(inv.code)}`;
    const maxedOut = inv.maxUses > 0 && inv.usedCount >= inv.maxUses;
    const expired = Boolean(inv.expiresAt && inv.expiresAt * 1000 < Date.now());
    return /*#__PURE__*/React.createElement("tr", {
      key: inv.id,
      className: "hover:bg-muted/20"
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3 font-mono font-bold text-brand-primary"
    }, inv.code, (maxedOut || expired) && /*#__PURE__*/React.createElement("span", {
      className: "ml-1.5 px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[10px] font-sans"
    }, expired ? t("已过期", "Expired") : t("已用尽", "Used Up"))), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3"
    }, inv.usedCount, " / ", inv.maxUses <= 0 ? t("不限", "∞") : inv.maxUses), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3"
    }, inv.defaultQuota <= 0 ? t("不限额", "Unlimited") : formatBytes(inv.defaultQuota)), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3 text-muted-foreground"
    }, inv.expiresAt ? formatDate(inv.expiresAt, locale) : t("永久有效", "Never")), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3 text-muted-foreground max-w-[160px] truncate"
    }, inv.note || "--"), /*#__PURE__*/React.createElement("td", {
      className: "py-2.5 px-3 text-right whitespace-nowrap space-x-1.5"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      className: "h-7 px-2 text-xs gap-1",
      onClick: () => handleCopyInvite(`code_${inv.id}`, inv.code)
    }, copiedInviteId === `code_${inv.id}` ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      className: "w-3 h-3 text-emerald-600"
    }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
      className: "w-3 h-3"
    }), " ", t("复制码", "Copy Code"))), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      className: "h-7 px-2 text-xs gap-1",
      onClick: () => handleCopyInvite(`link_${inv.id}`, registerLink)
    }, copiedInviteId === `link_${inv.id}` ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
      className: "w-3 h-3 text-emerald-600"
    }), t("已复制直链", "Copied Link")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
      className: "w-3 h-3"
    }), " ", t("注册直链", "Invite Link"))), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      className: "h-7 px-2 text-xs text-destructive hover:text-destructive",
      onClick: () => deleteInviteMutation.mutate(inv.id)
    }, /*#__PURE__*/React.createElement(Trash2, {
      className: "w-3.5 h-3.5"
    }))));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(UserPlus, {
    className: "w-4 h-4 text-brand-secondary"
  }), t("管理员手动新增用户", "Create User Manually")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreate,
    className: "grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("用户名", "Username")), /*#__PURE__*/React.createElement(Input, {
    value: newUsername,
    onChange: e => setNewUsername(e.target.value),
    placeholder: t("字母/数字/下划线", "Letters, digits, _"),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("初始口令 (≥8位)", "Initial Password (≥ 8 chars)")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: newPassword,
    onChange: e => setNewPassword(e.target.value),
    placeholder: t("至少 8 位字符", "At least 8 characters"),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("存储配额", "Storage Quota"), " (", computedNewBytes === 0 ? t("不限额", "Unlimited") : formatBytes(computedNewBytes), ")"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, newQuotaUnit !== "unlimited" && /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "1",
    value: newQuotaVal,
    onChange: e => setNewQuotaVal(Math.max(1, Number(e.target.value))),
    className: "w-24"
  }), /*#__PURE__*/React.createElement("select", {
    value: newQuotaUnit,
    onChange: e => setNewQuotaUnit(e.target.value),
    className: "flex-1 h-9 rounded-lg border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "unlimited"
  }, t("不限额 (Unlimited)", "Unlimited")), /*#__PURE__*/React.createElement("option", {
    value: "MB"
  }, "MB"), /*#__PURE__*/React.createElement("option", {
    value: "GB"
  }, "GB"), /*#__PURE__*/React.createElement("option", {
    value: "TB"
  }, "TB")))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: createMutation.isPending,
    className: "w-full gap-1.5"
  }, /*#__PURE__*/React.createElement(UserPlus, {
    className: "w-4 h-4"
  }), " ", t("开户", "Create"))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-12 flex items-center gap-2 pt-1 text-xs text-muted-foreground"
  }, /*#__PURE__*/React.createElement("input", {
    id: "new-must-change",
    type: "checkbox",
    checked: newMustChange,
    onChange: e => setNewMustChange(e.target.checked),
    className: "rounded border-input"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-must-change",
    className: "cursor-pointer select-none"
  }, t("要求该用户首次登录后立即修改初始口令", "Require this user to change their initial password upon first login"))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border shadow-sm overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-semibold text-brand-primary"
  }, t(`用户列表 (${users.length})`, `Users (${users.length})`))), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 text-muted-foreground flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-5 h-5 animate-spin text-brand-secondary"
  }), t("加载中...", "Loading...")) : /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b bg-muted/40 text-xs text-muted-foreground"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold"
  }, t("用户名", "Username")), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold"
  }, t("存储配额", "Quota")), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold"
  }, t("角色", "Role")), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold"
  }, t("账号状态", "Status")), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold text-center"
  }, t("保存属性", "Save")), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-4 font-semibold"
  }, t("重置口令", "Reset Password")))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y"
  }, users.map(u => /*#__PURE__*/React.createElement(UserRow, {
    key: u.username,
    user: u,
    isCurrent: u.username === currentUser?.username,
    onSave: (quota, role, enabled) => updateMutation.mutate({
      username: u.username,
      quota,
      role,
      enabled
    }),
    onResetPassword: (pwd, mustChange) => resetPasswordMutation.mutate({
      username: u.username,
      password: pwd,
      mustChangePassword: mustChange
    }),
    onError: msg => setFeedback({
      text: msg,
      type: "error"
    })
  })))))));
}
function UserRow({
  user,
  isCurrent,
  onSave,
  onResetPassword,
  onError
}) {
  const initial = bytesToUnitValue(user.storageQuota);
  const [quotaVal, setQuotaVal] = useState(initial.value);
  const [quotaUnit, setQuotaUnit] = useState(initial.unit);
  const [role, setRole] = useState(user.role || "USER");
  const [enabled, setEnabled] = useState(user.enabled !== false);
  const [newPwd, setNewPwd] = useState("");
  const [mustChange, setMustChange] = useState(false);
  const {
    t
  } = useI18n();
  useEffect(() => {
    const parsed = bytesToUnitValue(user.storageQuota);
    setQuotaVal(parsed.value);
    setQuotaUnit(parsed.unit);
    setRole(user.role || "USER");
    setEnabled(user.enabled !== false);
  }, [user.storageQuota, user.role, user.enabled]);
  const bytes = unitValueToBytes(quotaVal, quotaUnit);
  return /*#__PURE__*/React.createElement("tr", {
    className: "hover:bg-muted/20 transition-colors"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-semibold text-brand-primary whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("div", null, user.username, isCurrent && /*#__PURE__*/React.createElement("span", {
    className: "ml-1.5 text-xs text-brand-secondary"
  }, "(", t("当前登录", "You"), ")")), user.mustChangePassword && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-amber-600 font-normal block"
  }, t("待改初始密码", "Must change password"))), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, quotaUnit !== "unlimited" && /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "1",
    value: quotaVal,
    onChange: e => setQuotaVal(Math.max(1, Number(e.target.value))),
    className: "w-20 h-8 text-xs font-mono"
  }), /*#__PURE__*/React.createElement("select", {
    value: quotaUnit,
    onChange: e => setQuotaUnit(e.target.value),
    className: "h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "unlimited"
  }, t("不限额", "Unlimited")), /*#__PURE__*/React.createElement("option", {
    value: "MB"
  }, "MB"), /*#__PURE__*/React.createElement("option", {
    value: "GB"
  }, "GB"), /*#__PURE__*/React.createElement("option", {
    value: "TB"
  }, "TB")))), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("select", {
    value: role,
    disabled: isCurrent,
    onChange: e => setRole(e.target.value),
    className: "h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
  }, /*#__PURE__*/React.createElement("option", {
    value: "USER"
  }, "USER"), /*#__PURE__*/React.createElement("option", {
    value: "ADMIN"
  }, "ADMIN"))), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 whitespace-nowrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: enabled,
    disabled: isCurrent,
    onCheckedChange: setEnabled
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-xs ${enabled ? "text-emerald-600 font-medium" : "text-destructive"}`
  }, enabled ? t("正常", "Active") : t("已禁用", "Disabled")))), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-center"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 px-2.5 text-xs gap-1",
    onClick: () => onSave(bytes, role, enabled)
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-3.5 h-3.5"
  }), " ", t("保存", "Save"))), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: t("新口令 (≥8位)", "New pwd (≥8)"),
    value: newPwd,
    onChange: e => setNewPwd(e.target.value),
    className: "w-28 h-8 text-xs"
  }), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap cursor-pointer select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: mustChange,
    onChange: e => setMustChange(e.target.checked),
    className: "rounded border-input"
  }), t("需改密", "Force change")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 px-2.5 text-xs gap-1 shrink-0",
    onClick: () => {
      if (newPwd.length < 8) {
        onError(t("口令至少 8 位", "Password must be at least 8 characters"));
        return;
      }
      onResetPassword(newPwd, mustChange);
      setNewPwd("");
      setMustChange(false);
    }
  }, /*#__PURE__*/React.createElement(KeyRound, {
    className: "w-3.5 h-3.5"
  }), " ", t("重置", "Reset")))));
}
function SettingsTab() {
  const queryClient = useQueryClient();
  const {
    t
  } = useI18n();
  const [activeTab, setActiveTab] = useState("visual");
  const [yamlTab, setYamlTab] = useState("app");
  const [appYamlText, setAppYamlText] = useState("");
  const [adminYamlText, setAdminYamlText] = useState("");
  const [port, setPort] = useState(59898);
  const [servletSessionTimeout, setServletSessionTimeout] = useState("30d");
  const [sessionMaxAgeDays, setSessionMaxAgeDays] = useState(30);
  const [cookieName, setCookieName] = useState("STOREIT_SESSION");
  const [sslEnabled, setSslEnabled] = useState(false);
  const [keyStorePath, setKeyStorePath] = useState("./keystore.p12");
  const [keyStorePass, setKeyStorePass] = useState("changeit");
  const [keyStoreType, setKeyStoreType] = useState("PKCS12");
  const [storageRoot, setStorageRoot] = useState("storage");
  const [datasourceUrl, setDatasourceUrl] = useState("jdbc:sqlite:./data/storeit.db");
  const [maxFileSize, setMaxFileSize] = useState("100GB");
  const [maxRequestSize, setMaxRequestSize] = useState("100GB");
  const [appSslEnabled, setAppSslEnabled] = useState(false);
  const [requireCustomAdmin, setRequireCustomAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [maxFailures, setMaxFailures] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(15);
  const [logLevel, setLogLevel] = useState("info");
  const [message, setMessage] = useState(null);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => api.getAdminConfig()
  });
  useEffect(() => {
    if (data) {
      setAppYamlText(data.applicationYaml || "");
      setAdminYamlText(data.adminYaml || "");
      const appCfg = data.applicationConfig || {};
      const serverCfg = appCfg.server || {};
      const servletCfg = serverCfg.servlet || {};
      const srvSessionCfg = servletCfg.session || {};
      const sslCfg = serverCfg.ssl || {};
      const springCfg = appCfg.spring || {};
      const dsCfg = springCfg.datasource || {};
      const spServletCfg = springCfg.servlet || {};
      const multipartCfg = spServletCfg.multipart || {};
      const appProp = appCfg.app || {};
      const loginProp = appProp.login || {};
      const sessionProp = appProp.session || {};
      const loggingCfg = appCfg.logging || {};
      const levelCfg = loggingCfg.level || {};
      if (serverCfg.port !== undefined) setPort(Number(serverCfg.port));
      if (srvSessionCfg.timeout !== undefined) setServletSessionTimeout(String(srvSessionCfg.timeout));
      if (sessionProp["max-age-days"] !== undefined) setSessionMaxAgeDays(Number(sessionProp["max-age-days"]));
      if (sessionProp["cookie-name"] !== undefined) setCookieName(String(sessionProp["cookie-name"]));
      if (sslCfg.enabled !== undefined) setSslEnabled(Boolean(sslCfg.enabled));
      if (sslCfg["key-store"] !== undefined) setKeyStorePath(String(sslCfg["key-store"]));
      if (sslCfg["key-store-password"] !== undefined) setKeyStorePass(String(sslCfg["key-store-password"]));
      if (sslCfg["key-store-type"] !== undefined) setKeyStoreType(String(sslCfg["key-store-type"]));
      if (appProp["storage-root"] !== undefined) setStorageRoot(String(appProp["storage-root"]));
      if (dsCfg.url !== undefined) setDatasourceUrl(String(dsCfg.url));
      if (multipartCfg["max-file-size"] !== undefined) setMaxFileSize(String(multipartCfg["max-file-size"]));
      if (multipartCfg["max-request-size"] !== undefined) setMaxRequestSize(String(multipartCfg["max-request-size"]));
      if (appProp["ssl-enabled"] !== undefined) setAppSslEnabled(Boolean(appProp["ssl-enabled"]));
      if (appProp["require-custom-admin"] !== undefined) setRequireCustomAdmin(Boolean(appProp["require-custom-admin"]));
      if (loginProp["max-failures"] !== undefined) setMaxFailures(Number(loginProp["max-failures"]));
      if (loginProp["window-minutes"] !== undefined) setWindowMinutes(Number(loginProp["window-minutes"]));
      if (levelCfg.root !== undefined) setLogLevel(String(levelCfg.root).toLowerCase());
      const adminCfg = data.adminConfig || {};
      const defaultAdmin = (adminCfg.app || {})["default-admin"] || {};
      if (defaultAdmin.username) setAdminUsername(String(defaultAdmin.username));
    }
  }, [data]);
  const saveMutation = useMutation({
    mutationFn: payload => api.updateAdminConfig(payload),
    onSuccess: res => {
      setMessage({
        text: res.message || t("配置保存成功！", "Configuration saved successfully!"),
        type: "success"
      });
      setAdminPassword("");
      queryClient.invalidateQueries({
        queryKey: ["adminConfig"]
      });
    },
    onError: err => {
      setMessage({
        text: err.message || t("保存配置失败", "Failed to save configuration"),
        type: "error"
      });
    }
  });
  const handleSaveVisual = () => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      setMessage({
        text: t("保存失败：服务端口必须是 1–65535 之间的整数", "Save failed: server port must be an integer between 1 and 65535"),
        type: "error"
      });
      return;
    }
    if (!Number.isInteger(sessionMaxAgeDays) || sessionMaxAgeDays < 1 || sessionMaxAgeDays > 365) {
      setMessage({
        text: t("保存失败：会话保持天数必须是 1–365 之间的整数", "Save failed: session max-age days must be an integer between 1 and 365"),
        type: "error"
      });
      return;
    }
    if (!Number.isInteger(maxFailures) || maxFailures < 1 || maxFailures > 1000) {
      setMessage({
        text: t("保存失败：连续错误锁定次数必须是不小于 1 的整数", "Save failed: max login failures must be an integer >= 1"),
        type: "error"
      });
      return;
    }
    if (!Number.isInteger(windowMinutes) || windowMinutes < 1 || windowMinutes > 1440) {
      setMessage({
        text: t("保存失败：统计时间窗口分钟数必须是不小于 1 的整数", "Save failed: login throttle window minutes must be >= 1"),
        type: "error"
      });
      return;
    }
    if (!datasourceUrl.trim().startsWith("jdbc:sqlite:")) {
      setMessage({
        text: t("保存失败：SQLite 数据源 URL 必须以 jdbc:sqlite: 开头", "Save failed: SQLite datasource URL must start with jdbc:sqlite:"),
        type: "error"
      });
      return;
    }
    saveMutation.mutate({
      visualConfig: {
        port,
        servletSessionTimeout: servletSessionTimeout.trim() || "30d",
        sessionMaxAgeDays,
        cookieName: cookieName.trim() || "STOREIT_SESSION",
        sslEnabled,
        keyStorePath: keyStorePath.trim() || "./keystore.p12",
        keyStorePass,
        keyStoreType: keyStoreType.trim() || "PKCS12",
        storageRoot: storageRoot.trim() || "storage",
        datasourceUrl: datasourceUrl.trim(),
        maxFileSize: maxFileSize.trim() || "100GB",
        maxRequestSize: maxRequestSize.trim() || "100GB",
        appSslEnabled,
        requireCustomAdmin,
        maxFailures,
        windowMinutes,
        logLevel,
        adminUsername: adminUsername.trim() || "admin",
        adminPassword: adminPassword.trim() || undefined
      }
    });
  };
  const handleSaveRaw = () => {
    saveMutation.mutate({
      applicationYaml: appYamlText,
      adminYaml: adminYamlText
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Settings, {
    className: "w-6 h-6 text-brand-secondary"
  }), t("系统配置管理", "System Configuration")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mt-1"
  }, t("安全维护 StoreIt 核心运行参数与外部配置文件（./config/*.yml），自动创建 .bak 备份。注意：可视化保存会重写 YAML 且不保留注释，如需保留注释请使用「YAML 原文编辑」模式。", "Safely manage StoreIt runtime parameters and external config files (./config/*.yml) with automatic .bak backups. Note: Visual mode rewrites YAML without comments; use 'Raw YAML' to preserve comments."))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: activeTab === "visual" ? "default" : "outline",
    size: "sm",
    onClick: () => setActiveTab("visual"),
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(Sliders, {
    className: "w-4 h-4"
  }), t("可视化配置", "Visual Editor")), /*#__PURE__*/React.createElement(Button, {
    variant: activeTab === "raw" ? "default" : "outline",
    size: "sm",
    onClick: () => setActiveTab("raw"),
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(FileCode, {
    className: "w-4 h-4"
  }), t("YAML 原文编辑", "Raw YAML")))), message && /*#__PURE__*/React.createElement("div", {
    className: `p-4 rounded-xl flex items-start gap-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`
  }, message.type === "success" ? /*#__PURE__*/React.createElement(CheckCircle2, {
    className: "w-5 h-5 shrink-0 mt-0.5 text-emerald-600"
  }) : /*#__PURE__*/React.createElement(AlertTriangle, {
    className: "w-5 h-5 shrink-0 mt-0.5 text-destructive"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, message.text), message.type === "success" && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-700 mt-1"
  }, t("注意：端口、数据源、上传体积限制与 SSL 证书等核心参数修改后，需重启 StoreIt 进程生效。", "Note: Changes to port, datasource, upload limits, and SSL require restarting the StoreIt process to take effect.")))), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16 text-muted-foreground flex flex-col items-center gap-3"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-8 h-8 animate-spin text-brand-secondary"
  }), /*#__PURE__*/React.createElement("p", null, t("正在读取服务器配置...", "Loading server configuration..."))) : activeTab === "visual" ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2"
  }, /*#__PURE__*/React.createElement(Server, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("服务、会话与日志 (Server & Session)", "Server, Session & Logging")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("服务监听端口 (server.port)", "Listen Port (server.port)")), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: 1,
    max: 65535,
    value: port,
    onChange: e => setPort(Number(e.target.value)),
    placeholder: "59898"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("HTTP/HTTPS 监听端口 (1–65535)", "HTTP/HTTPS port (1–65535)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("会话保持天数 (app.session.max-age-days)", "Session Max Age Days (app.session.max-age-days)")), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: 1,
    max: 365,
    value: sessionMaxAgeDays,
    onChange: e => setSessionMaxAgeDays(Number(e.target.value)),
    placeholder: "30"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("登录会话有效时长（单位：天，1–365）", "Login session lifetime in days (1–365)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("容器会话超时 (server.servlet.session.timeout)", "Servlet Session Timeout")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: servletSessionTimeout,
    onChange: e => setServletSessionTimeout(e.target.value),
    placeholder: "30d"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("Spring 容器超时时长 (如 30d、12h、60m)", "Container timeout (e.g. 30d, 12h, 60m)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("会话 Cookie 名称 (app.session.cookie-name)", "Session Cookie Name")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: cookieName,
    onChange: e => setCookieName(e.target.value),
    placeholder: "STOREIT_SESSION"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("多实例同域名部署时可自定义区分", "Customize when running multiple instances on one domain"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("系统日志级别 (logging.level.root)", "Root Log Level (logging.level.root)")), /*#__PURE__*/React.createElement("select", {
    value: logLevel,
    onChange: e => setLogLevel(e.target.value),
    className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "info"
  }, t("INFO (默认推荐)", "INFO (Recommended)")), /*#__PURE__*/React.createElement("option", {
    value: "warn"
  }, t("WARN (仅警告与错误)", "WARN (Warnings & Errors)")), /*#__PURE__*/React.createElement("option", {
    value: "error"
  }, t("ERROR (仅错误)", "ERROR (Errors Only)")), /*#__PURE__*/React.createElement("option", {
    value: "debug"
  }, t("DEBUG (调试详情)", "DEBUG (Verbose)")), /*#__PURE__*/React.createElement("option", {
    value: "trace"
  }, t("TRACE (全量追踪)", "TRACE (Full Trace)"))), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("全局日志输出粒度", "Global log verbosity"))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2"
  }, /*#__PURE__*/React.createElement(Database, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("存储目录、数据库与上传限制 (Storage & Multipart)", "Storage, Database & Upload Limits")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("物理存储根目录 (app.storage-root)", "Storage Root Directory (app.storage-root)")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: storageRoot,
    onChange: e => setStorageRoot(e.target.value),
    placeholder: "storage"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("用户上传文件在磁盘上的根文件夹路径", "Root folder path on disk for uploaded files"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("SQLite 数据库连接 URL (spring.datasource.url)", "SQLite Datasource URL")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: datasourceUrl,
    onChange: e => setDatasourceUrl(e.target.value),
    placeholder: "jdbc:sqlite:./data/storeit.db"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("元数据库文件路径（需以 jdbc:sqlite: 开头）", "Metadata DB path (must start with jdbc:sqlite:)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("单文件最大上传限制 (spring.servlet.multipart.max-file-size)", "Max Single File Size")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: maxFileSize,
    onChange: e => setMaxFileSize(e.target.value),
    placeholder: "100GB"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("支持 MB / GB / TB 单位（如 100GB、10GB）", "Supports MB / GB / TB (e.g. 100GB, 10GB)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("单次请求最大体积 (spring.servlet.multipart.max-request-size)", "Max Multipart Request Size")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: maxRequestSize,
    onChange: e => setMaxRequestSize(e.target.value),
    placeholder: "100GB"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("建议与 max-file-size 保持一致（如 100GB）", "Recommended to match max-file-size (e.g. 100GB)"))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-primary font-semibold text-base"
  }, /*#__PURE__*/React.createElement(ShieldCheck, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("HTTPS 与 SSL 安全设置", "HTTPS & SSL Security")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-muted-foreground"
  }, sslEnabled ? t("已启用直连 SSL", "Direct SSL Enabled") : t("未启用 (HTTP 模式)", "Disabled (HTTP Mode)")), /*#__PURE__*/React.createElement(Switch, {
    checked: sslEnabled,
    onCheckedChange: checked => {
      setSslEnabled(checked);
      setAppSslEnabled(checked);
    }
  }))), sslEnabled && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-1"
  }, data?.keystoreExists === false && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(ShieldAlert, {
    className: "w-4 h-4 text-amber-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, t("警告：未在服务端路径 ", "Warning: Keystore file not found at "), /*#__PURE__*/React.createElement("code", {
    className: "bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold"
  }, keyStorePath), t(" 找到 Keystore 文件。若未准备证书直接开启，重启后服务器可能无法启动。", ". Enabling SSL without a valid keystore may prevent the server from starting."))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("KeyStore 证书文件路径 (server.ssl.key-store)", "KeyStore File Path")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: keyStorePath,
    onChange: e => setKeyStorePath(e.target.value),
    placeholder: "./keystore.p12"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("KeyStore 访问口令 (server.ssl.key-store-password)", "KeyStore Password")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: keyStorePass,
    onChange: e => setKeyStorePass(e.target.value),
    placeholder: "changeit"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("KeyStore 类型 (server.ssl.key-store-type)", "KeyStore Type")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: keyStoreType,
    onChange: e => setKeyStoreType(e.target.value),
    placeholder: "PKCS12"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-3 border-t text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-medium text-foreground"
  }, t("Cookie Secure 强制安全标记与 HSTS (app.ssl-enabled)", "Secure Cookie Flag & HSTS (app.ssl-enabled)")), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground text-[11px] max-w-lg"
  }, t("开启后 Session Cookie 仅允许在 HTTPS 加密通道下发送。直连 SSL 或由 Nginx / Caddy 等反向代理终结 HTTPS 时均应开启；纯 HTTP 部署必须关闭。", "When enabled, session cookies are only sent over HTTPS. Enable for direct SSL or HTTPS reverse proxies (Nginx/Caddy); keep disabled for plain HTTP."))), /*#__PURE__*/React.createElement(Switch, {
    checked: appSslEnabled,
    onCheckedChange: setAppSslEnabled
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2"
  }, /*#__PURE__*/React.createElement(HardDrive, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("登录防暴力破解规则 (app.login.*)", "Login Rate Limiting (app.login.*)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("连续错误锁定次数 (app.login.max-failures)", "Max Failed Attempts (app.login.max-failures)")), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: 1,
    max: 1000,
    value: maxFailures,
    onChange: e => setMaxFailures(Number(e.target.value))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("统计时间窗口分钟数 (app.login.window-minutes)", "Window Duration Minutes (app.login.window-minutes)")), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: 1,
    max: 1440,
    value: windowMinutes,
    onChange: e => setWindowMinutes(Number(e.target.value))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-2xl border shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2"
  }, /*#__PURE__*/React.createElement(KeyRound, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("初始外部管理员配置 (admin.yml)", "Bootstrap Admin Configuration (admin.yml)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("默认管理员账号 (app.default-admin.username)", "Default Admin Username")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    value: adminUsername,
    onChange: e => setAdminUsername(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("修改默认管理员口令 (app.default-admin.password)", "Update Default Admin Password")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: adminPassword,
    onChange: e => setAdminPassword(e.target.value),
    placeholder: t("留空保持原口令不变", "Leave blank to keep existing password")
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-muted-foreground mt-0.5 block"
  }, t("若留空则不会改动 admin.yml 中的已有口令", "Leaving blank preserves the current password in admin.yml")))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-2 border-t text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-medium text-foreground"
  }, t("拒绝默认内置口令启动 (app.require-custom-admin)", "Refuse Startup with Default Credentials (app.require-custom-admin)")), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground text-[11px]"
  }, t("若开启，当系统仍在使用初始口令 admin / authorized_users 时将直接拒绝启动以保障安全", "If enabled, StoreIt refuses to start while default credentials (admin / authorized_users) are still in use"))), /*#__PURE__*/React.createElement(Switch, {
    checked: requireCustomAdmin,
    onCheckedChange: setRequireCustomAdmin
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleSaveVisual,
    disabled: saveMutation.isPending,
    className: "gap-2 px-6 h-10 shadow-md"
  }, saveMutation.isPending ? /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-4 h-4 animate-spin"
  }) : /*#__PURE__*/React.createElement(Save, {
    className: "w-4 h-4"
  }), t("保存全部配置", "Save All Configuration")))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: yamlTab === "app" ? "default" : "outline",
    size: "sm",
    onClick: () => setYamlTab("app")
  }, "application.yml"), /*#__PURE__*/React.createElement(Button, {
    variant: yamlTab === "admin" ? "default" : "outline",
    size: "sm",
    onClick: () => setYamlTab("admin")
  }, "admin.yml")), /*#__PURE__*/React.createElement(Button, {
    onClick: handleSaveRaw,
    disabled: saveMutation.isPending,
    size: "sm",
    className: "gap-1.5 shadow-sm"
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-4 h-4"
  }), t("保存 YAML 文件", "Save YAML Files"))), /*#__PURE__*/React.createElement("div", {
    className: "relative border rounded-2xl bg-[#1e1e2e] text-[#cdd6f4] p-4 font-mono text-sm shadow-inner"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "w-full h-[450px] bg-transparent outline-none resize-none font-mono text-xs leading-relaxed selection:bg-brand-secondary/40",
    value: yamlTab === "app" ? appYamlText : adminYamlText,
    onChange: e => yamlTab === "app" ? setAppYamlText(e.target.value) : setAdminYamlText(e.target.value),
    spellCheck: false
  }))));
}
function AboutTab() {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 backdrop-blur-md rounded-3xl p-8 border shadow-lg text-center space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-xl"
  }, /*#__PURE__*/React.createElement(HardDrive, {
    className: "w-10 h-10"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-extrabold tracking-tight text-brand-primary"
  }, t("关于 储之 (StoreIt)", "About StoreIt")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-brand-secondary mt-1"
  }, t("轻量级、高性能、现代化的大文件存储与分享服务", "Lightweight, high-performance modern file storage & federated sharing server"))), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
  }), t("系统运行正常 · 版本 v2.1.0-dev", "System Healthy · Version v2.1.0-dev")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-foreground/80 leading-relaxed max-w-lg mx-auto"
  }, t("储之是一个基于 Spring Boot 3 与现代 React / Next.js 构建的文件服务器。默认支持 100GB 级特大文件多分片并行断点续传、文件拖拽极速归档、R/RW 共享文件夹与 SFSP 跨服联邦挂载，以及全量可视化系统配置维护。", "StoreIt is a self-hosted file server built on Spring Boot 3 and modern React / Next.js. It supports 100GB+ parallel resumable chunked uploads, drag-and-drop folder archiving, R/RW shared folders with SFSP cross-server federation, and visual YAML system configuration.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/GuilingQiyu/StoreIt",
    target: "_blank",
    rel: "noreferrer",
    className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary/90 transition-all shadow-md"
  }, /*#__PURE__*/React.createElement(Github, {
    className: "w-4 h-4"
  }), t("GitHub 仓库", "GitHub Repository"), /*#__PURE__*/React.createElement(ExternalLink, {
    className: "w-3.5 h-3.5 opacity-60"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-t pt-6 text-xs text-muted-foreground space-y-2"
  }, /*#__PURE__*/React.createElement("p", null, t("© 2025–2026 归灵祈昱. All rights reserved.", "© 2025–2026 GuilingQiyu. All rights reserved.")), /*#__PURE__*/React.createElement("p", {
    className: "flex items-center justify-center gap-1"
  }, t("本程序基于 ", "Licensed under "), /*#__PURE__*/React.createElement("a", {
    href: "https://www.gnu.org/licenses/agpl-3.0.html",
    target: "_blank",
    rel: "noreferrer",
    className: "text-brand-primary font-medium hover:underline inline-flex items-center gap-0.5"
  }, t("GNU AGPL-3.0 或更高版本", "GNU AGPL-3.0 or later")), t(" 开源授权。", ".")))));
}
function UploadItem({
  task
}) {
  const pauseTask = useUploadStore(s => s.pauseTask);
  const resumeTask = useUploadStore(s => s.resumeTask);
  const cancelTask = useUploadStore(s => s.cancelTask);
  const retryTask = useUploadStore(s => s.retryTask);
  const rebindFileAndResume = useUploadStore(s => s.rebindFileAndResume);
  const fileInputRef = useRef(null);
  const {
    t
  } = useI18n();
  const handleFilePicked = async e => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await rebindFileAndResume(task.id, file);
      } catch (err) {
        useFileStore.getState().showToast(err.message || t("文件匹配失败", "File mismatch"), "error");
      }
    }
  };
  const getStatusBadge = () => {
    switch (task.status) {
      case "uploading":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-brand-primary font-medium flex items-center gap-1"
        }, /*#__PURE__*/React.createElement("span", {
          className: "w-2 h-2 rounded-full bg-brand-primary animate-pulse"
        }), t("上传中", "Uploading"), " (", formatBytes(task.speed), "/s)");
      case "paused":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-amber-600 font-medium flex items-center gap-1"
        }, /*#__PURE__*/React.createElement(Pause, {
          className: "w-3 h-3"
        }), " ", t("已暂停", "Paused"));
      case "merging":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-indigo-600 font-medium flex items-center gap-1"
        }, /*#__PURE__*/React.createElement(RefreshCw, {
          className: "w-3 h-3 animate-spin"
        }), " ", t("合并文件中...", "Merging chunks..."));
      case "completed":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-emerald-600 font-medium flex items-center gap-1"
        }, /*#__PURE__*/React.createElement(CheckCircle2, {
          className: "w-3 h-3"
        }), " ", t("上传完成", "Completed"));
      case "interrupted":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-orange-600 font-medium flex items-center gap-1",
          title: task.errorMessage
        }, /*#__PURE__*/React.createElement(Clock, {
          className: "w-3 h-3"
        }), " ", t("已中断 (点击重新选择文件)", "Interrupted (rebind file)"));
      case "error":
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-destructive font-medium flex items-center gap-1",
          title: task.errorMessage
        }, /*#__PURE__*/React.createElement(AlertCircle, {
          className: "w-3 h-3"
        }), " ", t("上传失败", "Failed"));
      default:
        return /*#__PURE__*/React.createElement("span", {
          className: "text-xs text-muted-foreground"
        }, t("准备中...", "Preparing..."));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-white/70 hover:bg-white rounded-xl border border-black/5 transition-all shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-0 flex-1 mr-2"
  }, /*#__PURE__*/React.createElement(FileText, {
    className: "w-4 h-4 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium truncate",
    title: task.name
  }, task.name)), /*#__PURE__*/React.createElement("div", {
    className: "shrink-0"
  }, getStatusBadge())), /*#__PURE__*/React.createElement("div", {
    className: "my-1.5"
  }, /*#__PURE__*/React.createElement(Progress, {
    value: task.progress,
    className: "h-1.5 bg-black/5",
    indicatorColor: task.status === "completed" ? "bg-emerald-500" : task.status === "paused" ? "bg-amber-500" : task.status === "error" || task.status === "interrupted" ? "bg-orange-500" : "bg-brand-primary"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-muted-foreground mt-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, formatBytes(task.size * task.progress / 100)), /*#__PURE__*/React.createElement("span", {
    className: "mx-1"
  }, "/"), /*#__PURE__*/React.createElement("span", null, formatBytes(task.size)), task.totalChunks > 1 && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-black/40"
  }, "(", task.uploadedChunks.length, "/", task.totalChunks, " ", t("分片", "chunks"), ")")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, task.status === "uploading" && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-6 w-6 text-muted-foreground hover:text-foreground",
    onClick: () => pauseTask(task.id),
    title: t("暂停上传", "Pause upload")
  }, /*#__PURE__*/React.createElement(Pause, {
    className: "w-3.5 h-3.5"
  })), task.status === "paused" && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-6 w-6 text-muted-foreground hover:text-foreground",
    onClick: () => resumeTask(task.id),
    title: t("继续上传", "Resume upload")
  }, /*#__PURE__*/React.createElement(Play, {
    className: "w-3.5 h-3.5"
  })), task.status === "error" && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    className: "h-6 px-2 text-xs gap-1 border-rose-200 text-rose-700 hover:bg-rose-50",
    onClick: () => retryTask(task.id),
    title: t("重试上传", "Retry upload")
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-3 h-3"
  }), " ", t("重试", "Retry")), (task.status === "interrupted" || task.status === "error") && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    className: "hidden",
    onChange: handleFilePicked
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    className: "h-6 px-2 text-xs gap-1 border-orange-200 text-orange-700 hover:bg-orange-50",
    onClick: () => fileInputRef.current?.click(),
    title: t("重新选取同名文件以恢复断点续传", "Re-select the same file to resume upload")
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-3 h-3"
  }), " ", t("绑定续传", "Rebind"))), task.status !== "completed" && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-6 w-6 text-muted-foreground hover:text-destructive",
    onClick: () => cancelTask(task.id),
    title: t("取消上传", "Cancel upload")
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  })))), task.errorMessage && /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-destructive mt-1 truncate",
    title: task.errorMessage
  }, task.errorMessage));
}
function UploadDrawer() {
  const tasks = useUploadStore(s => s.tasks);
  const isDrawerOpen = useUploadStore(s => s.isDrawerOpen);
  const toggleDrawer = useUploadStore(s => s.toggleDrawer);
  const clearCompleted = useUploadStore(s => s.clearCompleted);
  const {
    t
  } = useI18n();
  if (tasks.length === 0) return null;
  const uploadingCount = tasks.filter(item => item.status === "uploading" || item.status === "merging").length;
  const completedCount = tasks.filter(item => item.status === "completed").length;
  const totalSpeed = tasks.reduce((sum, item) => sum + (item.speed || 0), 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/10 overflow-hidden transition-all duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: toggleDrawer,
    className: "flex items-center justify-between p-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white cursor-pointer select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(CloudUpload, {
    className: "w-5 h-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-sm"
  }, t("上传任务", "Uploads")), /*#__PURE__*/React.createElement("span", {
    className: "bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono"
  }, completedCount, "/", tasks.length), uploadingCount > 0 && totalSpeed > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-white/80 font-mono"
  }, "\xB7 ", formatBytes(totalSpeed), "/s")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1",
    onClick: e => e.stopPropagation()
  }, completedCount > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-7 w-7 text-white/80 hover:text-white hover:bg-white/10",
    onClick: clearCompleted,
    title: t("清除已完成任务", "Clear completed tasks")
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon",
    className: "h-7 w-7 text-white/80 hover:text-white hover:bg-white/10",
    onClick: toggleDrawer,
    title: isDrawerOpen ? t("收起面板", "Collapse panel") : t("展开面板", "Expand panel")
  }, isDrawerOpen ? /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(ChevronUp, {
    className: "w-4 h-4"
  })))), isDrawerOpen && /*#__PURE__*/React.createElement("div", {
    className: "max-h-80 overflow-y-auto p-3 space-y-2 divide-y divide-transparent"
  }, tasks.map(task => /*#__PURE__*/React.createElement(UploadItem, {
    key: task.id,
    task: task
  }))));
}
function NewFolderModal() {
  const isOpen = useFileStore(s => s.newFolderModalOpen);
  const setOpen = useFileStore(s => s.setNewFolderModalOpen);
  const currentPath = useFileStore(s => s.currentPath);
  const showToast = useFileStore(s => s.showToast);
  const [folderName, setFolderName] = useState("");
  const queryClient = useQueryClient();
  const {
    t
  } = useI18n();
  const createMutation = useMutation({
    mutationFn: name => api.createDirectory(currentPath, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      showToast(t("文件夹创建成功", "Folder created successfully"), "success");
      setFolderName("");
      setOpen(false);
    },
    onError: err => {
      showToast(err.message || t("创建文件夹失败", "Failed to create folder"), "error");
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (!folderName.trim()) return;
    createMutation.mutate(folderName.trim());
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: setOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(FolderPlus, {
    className: "w-5 h-5 text-amber-500"
  }), t("新建文件夹", "New Folder"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("文件夹名称", "Folder Name")), /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: folderName,
    onChange: e => setFolderName(e.target.value),
    placeholder: t("请输入文件夹名称", "Enter folder name"),
    required: true
  })), /*#__PURE__*/React.createElement(DialogFooter, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setOpen(false)
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: createMutation.isPending
  }, t("创建", "Create"))))));
}
const QUICK_TEMPLATES = [{
  labelZh: "Markdown 文档 (.md)",
  labelEn: "Markdown Doc (.md)",
  ext: ".md",
  defaultNameZh: "未命名笔记.md",
  defaultNameEn: "Untitled.md",
  templateZh: "# 标题\n\n> [!NOTE]\n> 在此记录想法、文档或待办事项。\n\n- [ ] 待办事项 1\n- [x] 已完成事项\n",
  templateEn: "# Title\n\n> [!NOTE]\n> Write your notes, documentation, or tasks here.\n\n- [ ] Todo item 1\n- [x] Completed item\n"
}, {
  labelZh: "纯文本 (.txt)",
  labelEn: "Plain Text (.txt)",
  ext: ".txt",
  defaultNameZh: "新建文本.txt",
  defaultNameEn: "notes.txt",
  templateZh: "",
  templateEn: ""
}, {
  labelZh: "YAML 配置 (.yml)",
  labelEn: "YAML Config (.yml)",
  ext: ".yml",
  defaultNameZh: "config.yml",
  defaultNameEn: "config.yml",
  templateZh: "# 配置文件\napp:\n  name: demo\n  enabled: true\n",
  templateEn: "# Configuration\napp:\n  name: demo\n  enabled: true\n"
}, {
  labelZh: "JSON 数据 (.json)",
  labelEn: "JSON Data (.json)",
  ext: ".json",
  defaultNameZh: "data.json",
  defaultNameEn: "data.json",
  templateZh: '{\n  "name": "example",\n  "version": "1.0.0"\n}\n',
  templateEn: '{\n  "name": "example",\n  "version": "1.0.0"\n}\n'
}];
function NewFileModal() {
  const isOpen = useFileStore(s => s.newFileModalOpen);
  const setOpen = useFileStore(s => s.setNewFileModalOpen);
  const currentPath = useFileStore(s => s.currentPath);
  const openEditor = useFileStore(s => s.openEditor);
  const showToast = useFileStore(s => s.showToast);
  const {
    isEn,
    t
  } = useI18n();
  const [fileName, setFileName] = useState("README.md");
  const [useStarterContent, setUseStarterContent] = useState(true);
  const [autoOpenEditor, setAutoOpenEditor] = useState(true);
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async () => {
      const trimmed = fileName.trim();
      const matched = QUICK_TEMPLATES.find(tpl => trimmed.toLowerCase().endsWith(tpl.ext));
      const initialContent = useStarterContent && matched ? isEn ? matched.templateEn : matched.templateZh : "";
      return api.createBlankFile(currentPath, trimmed, initialContent, "rename");
    },
    onSuccess: res => {
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      showToast(t(`文件 "${res.file.name}" 创建成功`, `File "${res.file.name}" created`), "success");
      setOpen(false);
      if (autoOpenEditor && res.file) {
        openEditor({
          name: res.file.name,
          path: res.file.path,
          isDirectory: false,
          size: res.file.size,
          modifiedTime: res.file.modifiedTime
        });
      }
    },
    onError: err => {
      showToast(err.message || t("创建文件失败", "Failed to create file"), "error");
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (!fileName.trim()) return;
    createMutation.mutate();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: setOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(FilePlus2, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("新建文本 / Markdown 文件", "New Text / Markdown File"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-muted-foreground block mb-1.5"
  }, t("快速选择文件类型", "Quick File Templates")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, QUICK_TEMPLATES.map(tpl => {
    const active = fileName.trim().toLowerCase().endsWith(tpl.ext);
    return /*#__PURE__*/React.createElement("button", {
      key: tpl.ext,
      type: "button",
      onClick: () => setFileName(isEn ? tpl.defaultNameEn : tpl.defaultNameZh),
      className: `px-3 py-2 rounded-xl border text-left text-xs transition-all ${active ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "bg-white hover:bg-black/5 text-foreground"}`
    }, isEn ? tpl.labelEn : tpl.labelZh);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("文件名称 (支持任意文本扩展名或无扩展名，如 Dockerfile)", "File Name (any text extension or extensionless like Dockerfile)")), /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: fileName,
    onChange: e => setFileName(e.target.value),
    placeholder: t("例如: README.md 或 notes.txt", "e.g. README.md or notes.txt"),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 pt-1 text-xs"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 cursor-pointer select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: useStarterContent,
    onChange: e => setUseStarterContent(e.target.checked),
    className: "rounded border-input text-brand-primary focus:ring-brand-primary"
  }), /*#__PURE__*/React.createElement("span", null, t("写入默认文件模板内容（如 Markdown 标题与大纲示例）", "Populate with starter template content"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 cursor-pointer select-none"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: autoOpenEditor,
    onChange: e => setAutoOpenEditor(e.target.checked),
    className: "rounded border-input text-brand-primary focus:ring-brand-primary"
  }), /*#__PURE__*/React.createElement("span", null, t("创建后立即打开在线编辑器", "Open in online editor immediately after creation")))), /*#__PURE__*/React.createElement(DialogFooter, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setOpen(false)
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: createMutation.isPending
  }, createMutation.isPending ? t("创建中...", "Creating...") : t("立即创建", "Create"))))));
}
function RenameModal() {
  const item = useFileStore(s => s.renameModalFile);
  const setRenameModalFile = useFileStore(s => s.setRenameModalFile);
  const showToast = useFileStore(s => s.showToast);
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();
  const {
    t
  } = useI18n();
  useEffect(() => {
    if (item) {
      setNewName(item.name);
    }
  }, [item]);
  const renameMutation = useMutation({
    mutationFn: name => api.renameFile(item.path, name),
    onSuccess: (_data, name) => {
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      const selected = useFileStore.getState().selectedFile;
      if (item && selected && selected.path === item.path) {
        const parent = item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : "";
        const nextPath = parent ? `${parent}/${name}` : name;
        useFileStore.getState().setSelectedFile({
          ...selected,
          name,
          path: nextPath
        });
      }
      showToast(t("重命名成功", "Renamed successfully"), "success");
      setRenameModalFile(null);
    },
    onError: err => {
      showToast(err.message || t("重命名失败", "Failed to rename"), "error");
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (!newName.trim() || newName === item?.name) return;
    renameMutation.mutate(newName.trim());
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(item),
    onOpenChange: open => !open && setRenameModalFile(null)
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Edit2, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("重命名", "Rename"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("新名称", "New Name")), /*#__PURE__*/React.createElement(Input, {
    autoFocus: true,
    value: newName,
    onChange: e => setNewName(e.target.value),
    placeholder: t("请输入新名称", "Enter new name"),
    required: true
  })), /*#__PURE__*/React.createElement(DialogFooter, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setRenameModalFile(null)
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: renameMutation.isPending
  }, t("确定", "Save"))))));
}
function MoveModal() {
  const item = useFileStore(s => s.moveModalFile);
  const setMoveModalFile = useFileStore(s => s.setMoveModalFile);
  const batchPaths = useFileStore(s => s.batchMovePaths);
  const setBatchMovePaths = useFileStore(s => s.setBatchMovePaths);
  const mode = useFileStore(s => s.moveModalMode);
  const setMode = useFileStore(s => s.setMoveModalMode);
  const clearSelection = useFileStore(s => s.clearSelection);
  const showToast = useFileStore(s => s.showToast);
  const {
    t
  } = useI18n();
  const [targetDir, setTargetDir] = useState("");
  const [rootFolders, setRootFolders] = useState([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const queryClient = useQueryClient();
  const isOpen = Boolean(item) || Boolean(batchPaths && batchPaths.length > 0);
  const movingPaths = batchPaths && batchPaths.length > 0 ? batchPaths : item ? [item.path] : [];
  const isCopy = mode === "copy";
  const isDisabledTarget = folderPath => {
    return movingPaths.some(mp => folderPath === mp || folderPath.startsWith(mp + "/"));
  };
  useEffect(() => {
    if (!isOpen) return;
    setLoadingTree(true);
    api.getFiles("").then(res => {
      const dirs = res.items.filter(it => it.isDirectory).map(it => ({
        name: it.name,
        path: it.path,
        loaded: false,
        expanded: false
      }));
      setRootFolders(dirs);
    }).catch(() => setRootFolders([])).finally(() => setLoadingTree(false));
  }, [isOpen]);
  const toggleExpandFolder = async targetPath => {
    const updateTree = async nodes => {
      const next = [];
      for (const n of nodes) {
        if (n.path === targetPath) {
          if (!n.loaded) {
            try {
              const res = await api.getFiles(n.path);
              const subDirs = res.items.filter(it => it.isDirectory).map(it => ({
                name: it.name,
                path: it.path,
                loaded: false,
                expanded: false
              }));
              next.push({
                ...n,
                loaded: true,
                expanded: true,
                children: subDirs
              });
            } catch {
              next.push({
                ...n,
                loaded: true,
                expanded: !n.expanded,
                children: []
              });
            }
          } else {
            next.push({
              ...n,
              expanded: !n.expanded
            });
          }
        } else if (n.children && n.children.length > 0) {
          next.push({
            ...n,
            children: await updateTree(n.children)
          });
        } else {
          next.push(n);
        }
      }
      return next;
    };
    setRootFolders(await updateTree(rootFolders));
  };
  const handleClose = () => {
    setMoveModalFile(null);
    setBatchMovePaths(null);
    setTargetDir("");
  };
  const actionMutation = useMutation({
    mutationFn: async to => {
      if (isCopy) {
        if (batchPaths && batchPaths.length > 0) {
          return api.batchCopyFiles(batchPaths, to);
        }
        return api.copyFile(item.path, to);
      } else {
        if (batchPaths && batchPaths.length > 0) {
          return api.batchMoveFiles(batchPaths, to);
        }
        return api.moveFile(item.path, to);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      queryClient.invalidateQueries({
        queryKey: ["favoritesList"]
      });
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      if (!isCopy) {
        const selected = useFileStore.getState().selectedFile;
        if (selected && movingPaths.includes(selected.path)) {
          useFileStore.getState().setSelectedFile(null);
        }
      }
      if (batchPaths && batchPaths.length > 0) {
        clearSelection();
        showToast(isCopy ? t(`已成功复制 ${batchPaths.length} 个项目`, `Copied ${batchPaths.length} items`) : t(`已成功移动 ${batchPaths.length} 个项目`, `Moved ${batchPaths.length} items`), "success");
      } else {
        showToast(isCopy ? t("文件已复制", "Item copied") : t("文件已移动", "Item moved"), "success");
      }
      handleClose();
    },
    onError: err => {
      showToast(err.message || (isCopy ? t("复制失败", "Copy failed") : t("移动失败", "Move failed")), "error");
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    actionMutation.mutate(targetDir.trim());
  };
  const renderTree = (nodes, depth = 0) => {
    return nodes.map(node => {
      const disabled = isDisabledTarget(node.path);
      const selected = targetDir === node.path;
      return /*#__PURE__*/React.createElement("div", {
        key: node.path
      }, /*#__PURE__*/React.createElement("div", {
        onClick: () => !disabled && setTargetDir(node.path),
        style: {
          paddingLeft: `${depth * 16 + 8}px`
        },
        className: `flex items-center gap-1.5 py-1.5 pr-2 rounded-lg text-xs cursor-pointer transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : selected ? "bg-brand-primary text-white font-semibold" : "hover:bg-black/5 text-foreground"}`
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: e => {
          e.stopPropagation();
          if (!disabled) toggleExpandFolder(node.path);
        },
        className: "p-0.5 rounded hover:bg-black/10 shrink-0",
        title: node.expanded ? t("折叠子目录", "Collapse") : t("展开子目录", "Expand")
      }, node.expanded ? /*#__PURE__*/React.createElement(ChevronDown, {
        className: "w-3.5 h-3.5"
      }) : /*#__PURE__*/React.createElement(ChevronRight, {
        className: "w-3.5 h-3.5"
      })), node.expanded ? /*#__PURE__*/React.createElement(FolderOpen, {
        className: `w-4 h-4 shrink-0 ${selected ? "text-amber-300" : "text-amber-500"}`
      }) : /*#__PURE__*/React.createElement(Folder, {
        className: `w-4 h-4 shrink-0 ${selected ? "text-amber-300" : "text-amber-500"}`
      }), /*#__PURE__*/React.createElement("span", {
        className: "truncate"
      }, node.name)), node.expanded && node.children && node.children.length > 0 && renderTree(node.children, depth + 1));
    });
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: open => !open && handleClose()
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center justify-between pr-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, isCopy ? /*#__PURE__*/React.createElement(Copy, {
    className: "w-5 h-5 text-brand-secondary"
  }) : /*#__PURE__*/React.createElement(FolderInput, {
    className: "w-5 h-5 text-brand-secondary"
  }), batchPaths && batchPaths.length > 0 ? t(`批量${isCopy ? "复制" : "移动"} (${batchPaths.length} 项)`, `Batch ${isCopy ? "Copy" : "Move"} (${batchPaths.length} items)`) : t(`${isCopy ? "复制" : "移动"}文件 / 目录`, `${isCopy ? "Copy" : "Move"} Item`)), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex rounded-lg border bg-muted/40 p-0.5 text-xs font-normal"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMode("move"),
    className: `px-2.5 py-0.5 rounded-md transition-all ${!isCopy ? "bg-white text-brand-primary font-semibold shadow-sm" : "text-muted-foreground"}`
  }, t("移动", "Move")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMode("copy"),
    className: `px-2.5 py-0.5 rounded-md transition-all ${isCopy ? "bg-white text-brand-primary font-semibold shadow-sm" : "text-muted-foreground"}`
  }, t("复制", "Copy"))))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1.5"
  }, t("点击选择目标文件夹", "Select Destination Folder")), /*#__PURE__*/React.createElement("div", {
    className: "border rounded-xl p-2 max-h-56 overflow-y-auto bg-muted/20 space-y-0.5 select-none"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setTargetDir(""),
    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${targetDir === "" ? "bg-brand-primary text-white font-semibold" : "hover:bg-black/5 text-foreground"}`
  }, /*#__PURE__*/React.createElement(Home, {
    className: "w-4 h-4 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, t("根目录 (/)", "Root (/)"))), loadingTree ? /*#__PURE__*/React.createElement("div", {
    className: "py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-3.5 h-3.5 animate-spin"
  }), t("正在加载目录树...", "Loading folder tree...")) : renderTree(rootFolders, 0))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("目标目录路径 (可直接点选上方目录或手动输入，留空为根目录)", "Target path (select above or type manually; leave blank for root)")), /*#__PURE__*/React.createElement(Input, {
    value: targetDir,
    onChange: e => setTargetDir(e.target.value),
    placeholder: t("例如: documents 或 photos/2026", "e.g. documents or photos/2026")
  })), /*#__PURE__*/React.createElement(DialogFooter, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: handleClose
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: actionMutation.isPending
  }, actionMutation.isPending ? t("处理中...", "Processing...") : isCopy ? t("确定复制到此处", "Copy Here") : t("确定移动到此处", "Move Here"))))));
}
function ShareModal() {
  const item = useFileStore(s => s.shareModalFile);
  const setShareModalFile = useFileStore(s => s.setShareModalFile);
  const openSharedSpace = useFileStore(s => s.openSharedSpace);
  const showToast = useFileStore(s => s.showToast);
  const queryClient = useQueryClient();
  const {
    t
  } = useI18n();
  const [permission, setPermission] = useState("READ");
  const [accessPassword, setAccessPassword] = useState("");
  const [title, setTitle] = useState("");
  const [expireHours, setExpireHours] = useState("168");
  const [customHours, setCustomHours] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  useEffect(() => {
    if (item) {
      setPermission("READ");
      setAccessPassword("");
      setTitle(item.name);
      setExpireHours("168");
      setCustomHours("");
      setMaxDownloads("");
      setGeneratedData(null);
      setCopiedKey(null);
    }
  }, [item]);
  const shareMutation = useMutation({
    mutationFn: data => api.createShare(data.filePath, data.expireHours, data.maxDownloads, data.permission, data.accessPassword, data.title),
    onSuccess: res => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const host = typeof window !== "undefined" ? window.location.host : "localhost:59898";
      const token = res.data.token;
      const pwdQuery = accessPassword.trim() ? `?key=${encodeURIComponent(accessPassword.trim())}` : "";
      setGeneratedData({
        token,
        directUrl: `${origin}/d/${token}`,
        webSpaceUrl: `${origin}/#/s/${token}`,
        federatedUri: `storeit+fed://${host}/api/fed/shares/${token}${pwdQuery}`
      });
      queryClient.invalidateQueries({
        queryKey: ["shares"]
      });
      showToast(item?.isDirectory ? t("共享文件夹与跨服协议链接已生成", "Shared folder & SFSP federation links created") : t("分享链接已生成", "Share link created"), "success");
    },
    onError: err => {
      showToast(err.message || t("生成分享链接失败", "Failed to create share link"), "error");
    }
  });
  const handleClose = () => {
    setShareModalFile(null);
    setGeneratedData(null);
    setCopiedKey(null);
  };
  const handleGenerate = e => {
    e.preventDefault();
    if (!item) return;
    let hours = parseInt(expireHours, 10);
    if (expireHours === "custom") {
      hours = parseInt(customHours, 10);
      if (!Number.isInteger(hours) || hours < 1) {
        showToast(t("自定义有效小时数必须为正整数", "Custom expiration hours must be a positive integer"), "error");
        return;
      }
    }
    let max = undefined;
    if (maxDownloads.trim()) {
      max = parseInt(maxDownloads, 10);
      if (!Number.isInteger(max) || max < 1) {
        showToast(t("最大下载次数必须为正整数", "Max downloads must be a positive integer"), "error");
        return;
      }
    }
    shareMutation.mutate({
      filePath: item.path,
      expireHours: hours,
      maxDownloads: max,
      permission,
      accessPassword: accessPassword.trim() || undefined,
      title: title.trim() || item.name
    });
  };
  const handleCopy = async (key, text) => {
    if (await copyToClipboard(text)) {
      setCopiedKey(key);
      showToast(t("已复制到剪贴板", "Copied to clipboard"), "success");
      setTimeout(() => setCopiedKey(null), 1800);
    } else {
      showToast(t("复制失败，请手动选取复制", "Copy failed, please copy manually"), "error");
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(item),
    onOpenChange: open => !open && handleClose()
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-lg storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Share2, {
    className: "w-5 h-5 text-brand-secondary"
  }), item?.isDirectory ? t("创建共享文件夹 / 跨服共享链接", "Create Shared Folder & Federation Link") : t("创建文件分享 / 协同链接", "Create File Share & Collaboration Link"))), generatedData ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 py-1 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, t("共享已生成（权限：", "Share created (Permission: "), permission === "READ_WRITE" ? t("可读写协同 RW", "Read/Write RW") : t("只读访问 R", "Read-Only R"), accessPassword.trim() ? ` · ${t("提取码", "Access Code")}: ${accessPassword.trim()}` : "", t("）", ")")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px]"
  }, t("对方可通过 Web 互动链接在线浏览/编辑，或在任意 StoreIt 服务器通过 SFSP 跨服协议挂载。", "Recipients can browse/edit via the interactive web link or mount it on any StoreIt node via SFSP/1.0."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-semibold text-foreground block mb-1"
  }, t("1. Web 共享空间互动链接（推荐：支持在线浏览目录、预览与 RW 读写协同）", "1. Interactive Web Space Link (Recommended: browse, preview & RW collaborate)")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true,
    value: generatedData.webSpaceUrl,
    className: "text-xs font-mono"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => handleCopy("web", generatedData.webSpaceUrl),
    className: "gap-1 shrink-0"
  }, copiedKey === "web" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-emerald-300"
  }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5"
  }), " ", t("复制", "Copy"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-semibold text-foreground block mb-1"
  }, t("2. 直接下载 / 文件夹 ZIP 打包直链（防聊天软件爬虫误扣次数）", "2. Direct File / Folder ZIP Download Link")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true,
    value: generatedData.directUrl,
    className: "text-xs font-mono"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => handleCopy("direct", generatedData.directUrl),
    className: "gap-1 shrink-0"
  }, copiedKey === "direct" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-emerald-600"
  }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5"
  }), " ", t("复制", "Copy"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-semibold text-foreground flex items-center gap-1.5 mb-1"
  }, /*#__PURE__*/React.createElement(Globe, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("3. 跨服联邦挂载协议地址 (SFSP/1.0 · 可在其他 StoreIt 实例一键挂载)", "3. Cross-Server Federation URI (SFSP/1.0 · mount on any StoreIt instance)")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    readOnly: true,
    value: generatedData.federatedUri,
    className: "text-xs font-mono"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => handleCopy("fed", generatedData.federatedUri),
    className: "gap-1 shrink-0"
  }, copiedKey === "fed" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-emerald-600"
  }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5"
  }), " ", t("复制协议串", "Copy URI"))))), /*#__PURE__*/React.createElement(DialogFooter, {
    className: "gap-2 pt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => {
      const tok = generatedData.token;
      const pwd = accessPassword.trim();
      handleClose();
      openSharedSpace(tok, "", pwd);
    }
  }, t("立即在共享空间中打开", "Open in Shared Space")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    onClick: handleClose
  }, t("完成", "Done")))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleGenerate,
    className: "space-y-3.5 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border"
  }, item?.isDirectory ? /*#__PURE__*/React.createElement(Folder, {
    className: "w-5 h-5 text-amber-500 shrink-0"
  }) : /*#__PURE__*/React.createElement(FileText, {
    className: "w-5 h-5 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-brand-primary truncate"
  }, item?.name), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground truncate"
  }, t("路径", "Path"), ": /", item?.path, " (", item?.isDirectory ? t("文件夹共享", "Folder Share") : t("单文件分享", "File Share"), ")"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-semibold text-foreground flex items-center gap-1.5 mb-1.5"
  }, /*#__PURE__*/React.createElement(ShieldCheck, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("共享读写权限管控 (R / RW)", "Access Permission (R / RW)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPermission("READ"),
    className: `p-2.5 rounded-xl border text-left transition-all ${permission === "READ" ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "bg-white hover:bg-black/5 text-foreground"}`
  }, /*#__PURE__*/React.createElement("div", null, t("只读权限 (R)", "Read-Only (R)")), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-muted-foreground font-normal mt-0.5"
  }, t("仅允许浏览子目录、在线预览与下载", "Browse folders, preview & download only"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPermission("READ_WRITE"),
    className: `p-2.5 rounded-xl border text-left transition-all ${permission === "READ_WRITE" ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "bg-white hover:bg-black/5 text-foreground"}`
  }, /*#__PURE__*/React.createElement("div", null, t("可读写协同 (RW)", "Read & Write (RW)")), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-muted-foreground font-normal mt-0.5"
  }, t("允许上传、新建、在线编辑与删除子项", "Allow upload, create, online edit & delete"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-medium text-foreground flex items-center gap-1 mb-1"
  }, /*#__PURE__*/React.createElement(Lock, {
    className: "w-3 h-3 text-brand-secondary"
  }), t("访问提取码 (留空则公开)", "Access Code (optional)")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    placeholder: t("可选，如 8888 或 team2026", "Optional, e.g. 8888 or team2026"),
    value: accessPassword,
    onChange: e => setAccessPassword(e.target.value),
    className: "font-mono text-xs h-9"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-medium text-foreground block mb-1"
  }, t("共享显示名称", "Display Title")), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    placeholder: t("共享标题", "Share title"),
    value: title,
    onChange: e => setTitle(e.target.value),
    className: "text-xs h-9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-medium text-foreground block mb-1"
  }, t("链接有效期", "Expiration")), /*#__PURE__*/React.createElement("select", {
    value: expireHours,
    onChange: e => setExpireHours(e.target.value),
    className: "w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
  }, /*#__PURE__*/React.createElement("option", {
    value: "24"
  }, t("1 天", "1 Day")), /*#__PURE__*/React.createElement("option", {
    value: "168"
  }, t("7 天", "7 Days")), /*#__PURE__*/React.createElement("option", {
    value: "720"
  }, t("30 天", "30 Days")), /*#__PURE__*/React.createElement("option", {
    value: "-1"
  }, t("永久有效", "Never Expire")), /*#__PURE__*/React.createElement("option", {
    value: "custom"
  }, t("自定义小时数", "Custom Hours"))), expireHours === "custom" && /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "1",
    placeholder: t("有效小时数 (如 48)", "Hours (e.g. 48)"),
    value: customHours,
    onChange: e => setCustomHours(e.target.value),
    className: "mt-1.5 text-xs h-8",
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-medium text-foreground block mb-1"
  }, t("最大下载次数 (留空不限)", "Max Downloads (blank = unlimited)")), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "1",
    placeholder: t("例如: 50", "e.g. 50"),
    value: maxDownloads,
    onChange: e => setMaxDownloads(e.target.value),
    className: "text-xs h-9"
  }))), /*#__PURE__*/React.createElement(DialogFooter, {
    className: "pt-1"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: handleClose
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: shareMutation.isPending
  }, shareMutation.isPending ? t("生成中...", "Generating...") : t("生成共享与跨服协议链接", "Generate Share & SFSP Link"))))));
}
function slugifyHeading(text, index) {
  const clean = text.replace(/[`*_~=#<>[\]()!]/g, "").trim().toLowerCase().replace(/\s+/g, "-");
  return `md-h-${index}-${clean || index}`;
}
function resolveRelativePath(baseFilePath, relUrl) {
  if (!relUrl) return "";
  if (relUrl.startsWith("http://") || relUrl.startsWith("https://") || relUrl.startsWith("data:") || relUrl.startsWith("blob:") || relUrl.startsWith("/")) {
    return relUrl;
  }
  const baseDir = baseFilePath && baseFilePath.includes("/") ? baseFilePath.slice(0, baseFilePath.lastIndexOf("/")) : "";
  const combined = baseDir ? `${baseDir}/${relUrl}` : relUrl;
  const parts = combined.split("/");
  const resolved = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return getPreviewUrl(resolved.join("/"));
}
const LATEX_SYMBOLS = {
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\epsilon": "ε",
  "\\zeta": "ζ",
  "\\eta": "η",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\pi": "π",
  "\\rho": "ρ",
  "\\sigma": "σ",
  "\\tau": "τ",
  "\\phi": "φ",
  "\\omega": "ω",
  "\\Delta": "Δ",
  "\\Sigma": "Σ",
  "\\Omega": "Ω",
  "\\Pi": "Π",
  "\\infty": "∞",
  "\\pm": "±",
  "\\mp": "∓",
  "\\times": "×",
  "\\div": "÷",
  "\\cdot": "·",
  "\\neq": "≠",
  "\\ne": "≠",
  "\\leq": "≤",
  "\\le": "≤",
  "\\geq": "≥",
  "\\ge": "≥",
  "\\approx": "≈",
  "\\equiv": "≡",
  "\\propto": "∝",
  "\\sum": "∑",
  "\\prod": "∏",
  "\\int": "∫",
  "\\partial": "∂",
  "\\nabla": "∇",
  "\\forall": "∀",
  "\\exists": "∃",
  "\\in": "∈",
  "\\notin": "∉",
  "\\subset": "⊂",
  "\\subseteq": "⊆",
  "\\cup": "∪",
  "\\cap": "∩",
  "\\rightarrow": "→",
  "\\to": "→",
  "\\leftarrow": "←",
  "\\Rightarrow": "⇒",
  "\\Leftarrow": "⇐",
  "\\leftrightarrow": "↔",
  "\\Leftrightarrow": "⇔"
};
function formatMathExpression(expr) {
  let text = expr.trim();
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");
  text = text.replace(/\\text\{([^{}]+)\}/g, "$1");
  for (const [cmd, sym] of Object.entries(LATEX_SYMBOLS)) {
    text = text.split(cmd).join(sym);
  }
  const parts = [];
  const tokenRegex = /(\^\{([^{}]+)\}|\^([a-zA-Z0-9+-])|_\{([^{}]+)\}|_([a-zA-Z0-9+-]))/g;
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const supContent = match[2] || match[3];
    const subContent = match[4] || match[5];
    if (supContent !== undefined) {
      parts.push( /*#__PURE__*/React.createElement("sup", {
        key: `m_${key++}`,
        className: "text-[0.75em] font-semibold"
      }, supContent));
    } else if (subContent !== undefined) {
      parts.push( /*#__PURE__*/React.createElement("sub", {
        key: `m_${key++}`,
        className: "text-[0.75em]"
      }, subContent));
    }
    lastIdx = tokenRegex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}
function highlightCodeLine(line) {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("--")) {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-[#6c7086] italic"
    }, line);
  }
  const tokenRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|export|default|function|return|const|let|var|if|else|for|while|switch|case|break|continue|class|interface|type|extends|implements|new|try|catch|finally|throw|async|await|public|private|protected|static|final|void|int|long|double|boolean|true|false|null|undefined|def|elif|None|True|False|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP|ORDER|BY|LIMIT)\b|\b\d+(?:\.\d+)?\b)/g;
  const nodes = [];
  let lastIndex = 0;
  let m;
  let k = 0;
  while ((m = tokenRegex.exec(line)) !== null) {
    if (m.index > lastIndex) {
      nodes.push(line.slice(lastIndex, m.index));
    }
    const tok = m[0];
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith("`")) {
      nodes.push( /*#__PURE__*/React.createElement("span", {
        key: k++,
        className: "text-[#a6e3a1]"
      }, tok));
    } else if (/^\d/.test(tok)) {
      nodes.push( /*#__PURE__*/React.createElement("span", {
        key: k++,
        className: "text-[#fab387]"
      }, tok));
    } else {
      nodes.push( /*#__PURE__*/React.createElement("span", {
        key: k++,
        className: "text-[#cba6f7] font-semibold"
      }, tok));
    }
    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}
function CodeBlockView({
  lang,
  code
}) {
  const [copied, setCopied] = useState(false);
  const [showLineNums, setShowLineNums] = useState(true);
  const lines = useMemo(() => code.split("\n"), [code]);
  const normalizedLang = (lang || "text").toLowerCase();
  const {
    t
  } = useI18n();
  const handleCopy = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  if (normalizedLang === "math" || normalizedLang === "latex" || normalizedLang === "katex") {
    return /*#__PURE__*/React.createElement("div", {
      className: "my-3 p-4 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto"
    }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "py-0.5"
    }, formatMathExpression(l))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "my-3.5 rounded-xl overflow-hidden border border-white/10 bg-[#1e1e2e] text-[#cdd6f4] shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-3.5 py-1.5 bg-[#181825] border-b border-white/10 text-[11px] text-[#a6adc8] select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 font-mono uppercase tracking-wider text-[#89b4fa] font-semibold"
  }, normalizedLang), /*#__PURE__*/React.createElement("span", {
    className: "text-white/20"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, t(`${lines.length} 行`, `${lines.length} lines`))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowLineNums(v => !v),
    className: "px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
  }, showLineNums ? t("隐藏行号", "Hide Lines") : t("显示行号", "Show Lines")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleCopy,
    className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 text-[#cdd6f4] transition-colors"
  }, copied ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    className: "w-3 h-3 text-emerald-400"
  }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3 h-3"
  }), " ", t("复制代码", "Copy Code"))))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 overflow-x-auto font-mono text-xs leading-relaxed"
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "table-row hover:bg-white/[0.03]"
  }, showLineNums && /*#__PURE__*/React.createElement("span", {
    className: "table-cell pr-4 text-right select-none text-[#585b70] w-8"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "table-cell whitespace-pre"
  }, highlightCodeLine(l))))));
}
function parseTableCells(row) {
  let trimmed = row.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  const cells = [];
  let current = "";
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === "\\" && i + 1 < trimmed.length && trimmed[i + 1] === "|") {
      current += "|";
      i++;
    } else if (trimmed[i] === "|") {
      cells.push(current.trim());
      current = "";
    } else {
      current += trimmed[i];
    }
  }
  cells.push(current.trim());
  return cells;
}
function MarkdownRenderer({
  content,
  basePath,
  showToc = true
}) {
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const {
    isEn,
    t
  } = useI18n();
  const {
    elements,
    headings,
    footnotes
  } = useMemo(() => {
    const rawLines = (content || "").split(/\r?\n/);
    const tocList = [];
    const footnoteMap = new Map();
    const bodyLines = [];
    let frontmatter = null;
    let startLine = 0;
    if (rawLines[0]?.trim() === "---") {
      let endFm = -1;
      for (let i = 1; i < Math.min(rawLines.length, 40); i++) {
        if (rawLines[i].trim() === "---" || rawLines[i].trim() === "...") {
          endFm = i;
          break;
        }
      }
      if (endFm > 0) {
        const fmData = {};
        for (let i = 1; i < endFm; i++) {
          const m = rawLines[i].match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
          if (m) {
            fmData[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
          }
        }
        if (Object.keys(fmData).length > 0) {
          frontmatter = fmData;
        }
        startLine = endFm + 1;
      }
    }
    for (let i = startLine; i < rawLines.length; i++) {
      const fnMatch = rawLines[i].match(/^\[\^([^\]]+)\]:\s*(.+)$/);
      if (fnMatch) {
        footnoteMap.set(fnMatch[1], fnMatch[2].trim());
      } else {
        bodyLines.push(rawLines[i]);
      }
    }
    const renderInline = (text, keyPrefix = "in") => {
      if (!text) return null;
      const inlineRegex = /(`[^`]+`|\$(?!\s)[^$\n]+(?<!\s)\$|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\[\^[^\]]+\]|\[\[[^\]]+\]\]|<kbd>[^<]+<\/kbd>|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|==[^=]+==|\^[^^\s]+\^|~[^~\s]+~|\*(?!\s)[^*]+(?<!\s)\*|https?:\/\/[^\s<)]+)/g;
      const out = [];
      let lastIdx = 0;
      let match;
      let tokenIdx = 0;
      while ((match = inlineRegex.exec(text)) !== null) {
        if (match.index > lastIdx) {
          out.push(text.slice(lastIdx, match.index));
        }
        const token = match[0];
        const k = `${keyPrefix}_${tokenIdx++}`;
        if (token.startsWith("`") && token.endsWith("`")) {
          out.push( /*#__PURE__*/React.createElement("code", {
            key: k,
            className: "px-1.5 py-0.5 mx-0.5 rounded-md bg-brand-primary/10 text-brand-primary font-mono text-[0.88em] font-medium"
          }, token.slice(1, -1)));
        } else if (token.startsWith("$") && token.endsWith("$")) {
          out.push( /*#__PURE__*/React.createElement("span", {
            key: k,
            className: "px-1 py-0.5 mx-0.5 rounded bg-indigo-500/10 text-indigo-900 font-serif italic"
          }, formatMathExpression(token.slice(1, -1))));
        } else if (token.startsWith("![")) {
          const imgMatch = token.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const src = resolveRelativePath(basePath, imgMatch[2]);
            const title = imgMatch[3];
            out.push( /*#__PURE__*/React.createElement("span", {
              key: k,
              className: "inline-block my-2 max-w-full"
            }, /*#__PURE__*/React.createElement("img", {
              src: src,
              alt: alt,
              title: title || alt,
              className: "max-h-96 max-w-full rounded-xl border shadow-sm object-contain mx-auto"
            }), alt && /*#__PURE__*/React.createElement("span", {
              className: "block text-center text-[11px] text-muted-foreground mt-1"
            }, alt)));
          } else {
            out.push(token);
          }
        } else if (token.startsWith("[^") && token.endsWith("]")) {
          const fnId = token.slice(2, -1);
          out.push( /*#__PURE__*/React.createElement("sup", {
            key: k,
            className: "ml-0.5"
          }, /*#__PURE__*/React.createElement("a", {
            href: `#fn-def-${fnId}`,
            id: `fn-ref-${fnId}`,
            className: "text-[11px] font-semibold text-brand-primary hover:underline px-0.5 rounded bg-brand-primary/10",
            title: footnoteMap.get(fnId) || (isEn ? `Footnote ${fnId}` : `脚注 ${fnId}`)
          }, "[", fnId, "]")));
        } else if (token.startsWith("[[") && token.endsWith("]]")) {
          out.push( /*#__PURE__*/React.createElement("kbd", {
            key: k,
            className: "px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-muted border border-b-2 rounded-md text-foreground shadow-sm"
          }, token.slice(2, -2)));
        } else if (token.startsWith("<kbd>") && token.endsWith("</kbd>")) {
          out.push( /*#__PURE__*/React.createElement("kbd", {
            key: k,
            className: "px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-muted border border-b-2 rounded-md text-foreground shadow-sm"
          }, token.slice(5, -6)));
        } else if (token.startsWith("[")) {
          const linkMatch = token.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
          if (linkMatch) {
            const label = linkMatch[1];
            const rawHref = linkMatch[2];
            const title = linkMatch[3];
            const safeHref = /^(https?:\/\/|mailto:|#|\/)/i.test(rawHref) ? rawHref : "#";
            out.push( /*#__PURE__*/React.createElement("a", {
              key: k,
              href: safeHref,
              title: title,
              target: safeHref.startsWith("#") ? undefined : "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
            }, renderInline(label, `${k}_lbl`)));
          } else {
            out.push(token);
          }
        } else if (token.startsWith("***") && token.endsWith("***")) {
          out.push( /*#__PURE__*/React.createElement("strong", {
            key: k,
            className: "font-bold italic"
          }, renderInline(token.slice(3, -3), k)));
        } else if (token.startsWith("**") && token.endsWith("**") || token.startsWith("__") && token.endsWith("__")) {
          out.push( /*#__PURE__*/React.createElement("strong", {
            key: k,
            className: "font-bold text-foreground"
          }, renderInline(token.slice(2, -2), k)));
        } else if (token.startsWith("~~") && token.endsWith("~~")) {
          out.push( /*#__PURE__*/React.createElement("del", {
            key: k,
            className: "line-through text-muted-foreground"
          }, renderInline(token.slice(2, -2), k)));
        } else if (token.startsWith("==") && token.endsWith("==")) {
          out.push( /*#__PURE__*/React.createElement("mark", {
            key: k,
            className: "bg-amber-200/80 text-amber-950 px-1 py-0.2 rounded font-medium"
          }, renderInline(token.slice(2, -2), k)));
        } else if (token.startsWith("^") && token.endsWith("^") && token.length > 2) {
          out.push( /*#__PURE__*/React.createElement("sup", {
            key: k,
            className: "text-[0.75em]"
          }, token.slice(1, -1)));
        } else if (token.startsWith("~") && token.endsWith("~") && token.length > 2) {
          out.push( /*#__PURE__*/React.createElement("sub", {
            key: k,
            className: "text-[0.75em]"
          }, token.slice(1, -1)));
        } else if (token.startsWith("*") && token.endsWith("*")) {
          out.push( /*#__PURE__*/React.createElement("em", {
            key: k,
            className: "italic"
          }, renderInline(token.slice(1, -1), k)));
        } else if (/^https?:\/\//i.test(token)) {
          out.push( /*#__PURE__*/React.createElement("a", {
            key: k,
            href: token,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-600 hover:text-blue-700 underline underline-offset-2 break-all"
          }, token));
        } else {
          out.push(token);
        }
        lastIdx = inlineRegex.lastIndex;
      }
      if (lastIdx < text.length) {
        out.push(text.slice(lastIdx));
      }
      return out;
    };
    const renderedBlocks = [];
    if (frontmatter) {
      renderedBlocks.push( /*#__PURE__*/React.createElement("div", {
        key: "frontmatter",
        className: "mb-4 p-3 rounded-xl bg-muted/50 border text-xs flex flex-wrap gap-x-4 gap-y-1.5"
      }, Object.entries(frontmatter).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
        key: k,
        className: "flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-mono text-muted-foreground"
      }, k, ":"), /*#__PURE__*/React.createElement("span", {
        className: "font-semibold text-brand-primary"
      }, v)))));
    }
    let i = 0;
    while (i < bodyLines.length) {
      const line = bodyLines[i];
      const trimmed = line.trim();
      if (!trimmed) {
        i++;
        continue;
      }
      const fenceMatch = trimmed.match(/^(`{3,}|~{3,})(.*)$/);
      if (fenceMatch) {
        const fence = fenceMatch[1];
        const lang = (fenceMatch[2] || "").trim();
        const codeLines = [];
        i++;
        while (i < bodyLines.length && !bodyLines[i].trim().startsWith(fence)) {
          codeLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) i++;
        renderedBlocks.push( /*#__PURE__*/React.createElement(CodeBlockView, {
          key: `code_${i}`,
          lang: lang,
          code: codeLines.join("\n")
        }));
        continue;
      }
      if (trimmed.startsWith("$$")) {
        if (trimmed.endsWith("$$") && trimmed.length > 4) {
          const expr = trimmed.slice(2, -2);
          renderedBlocks.push( /*#__PURE__*/React.createElement("div", {
            key: `math_${i}`,
            className: "my-3 p-3.5 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto"
          }, formatMathExpression(expr)));
          i++;
          continue;
        }
        const mathLines = [];
        if (trimmed.slice(2).trim()) mathLines.push(trimmed.slice(2));
        i++;
        while (i < bodyLines.length && !bodyLines[i].trim().endsWith("$$")) {
          mathLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) {
          const closing = bodyLines[i].trim().slice(0, -2).trim();
          if (closing) mathLines.push(closing);
          i++;
        }
        renderedBlocks.push( /*#__PURE__*/React.createElement("div", {
          key: `math_blk_${i}`,
          className: "my-3 p-3.5 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto"
        }, mathLines.map((ml, idx) => /*#__PURE__*/React.createElement("div", {
          key: idx
        }, formatMathExpression(ml)))));
        continue;
      }
      const directiveMatch = trimmed.match(/^:::\s*([a-zA-Z]+)(?:\s+(.*))?$/);
      if (directiveMatch) {
        const dirType = directiveMatch[1].toLowerCase();
        const dirTitle = directiveMatch[2] || "";
        const innerLines = [];
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== ":::") {
          innerLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) i++;
        if (dirType === "details") {
          renderedBlocks.push( /*#__PURE__*/React.createElement("details", {
            key: `details_${i}`,
            className: "my-3 rounded-xl border bg-muted/20 p-3 text-sm group"
          }, /*#__PURE__*/React.createElement("summary", {
            className: "font-semibold cursor-pointer select-none text-brand-primary"
          }, dirTitle || (isEn ? "Click to expand details" : "点击展开详情")), /*#__PURE__*/React.createElement("div", {
            className: "mt-2 pt-2 border-t text-foreground space-y-1.5"
          }, innerLines.map((il, idx) => /*#__PURE__*/React.createElement("p", {
            key: idx
          }, renderInline(il, `det_${i}_${idx}`))))));
        } else {
          renderedBlocks.push(renderAdmonition(dirType.toUpperCase(), dirTitle, innerLines, `dir_${i}`, renderInline, isEn));
        }
        continue;
      }
      if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        renderedBlocks.push( /*#__PURE__*/React.createElement("hr", {
          key: `hr_${i}`,
          className: "my-4 border-t border-border"
        }));
        i++;
        continue;
      }
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const rawHeadingText = headingMatch[2].replace(/\s+#+\s*$/, "").trim();
        const id = slugifyHeading(rawHeadingText, tocList.length);
        tocList.push({
          id,
          level,
          text: rawHeadingText
        });
        const headingClasses = {
          1: "text-2xl font-extrabold text-brand-primary mt-5 mb-2.5 pb-1.5 border-b",
          2: "text-xl font-bold text-brand-primary mt-4 mb-2 pb-1 border-b border-border/60",
          3: "text-lg font-bold text-brand-primary mt-3.5 mb-1.5",
          4: "text-base font-semibold text-brand-primary mt-3 mb-1",
          5: "text-sm font-semibold text-brand-primary mt-2.5 mb-1",
          6: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2 mb-1"
        };
        const Tag = `h${level}`;
        renderedBlocks.push( /*#__PURE__*/React.createElement(Tag, {
          key: `h_${i}`,
          id: id,
          className: headingClasses[level]
        }, renderInline(rawHeadingText, `h_${i}`)));
        i++;
        continue;
      }
      if (line.includes("|") && i + 1 < bodyLines.length && /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(bodyLines[i + 1])) {
        const headerCells = parseTableCells(bodyLines[i]);
        const alignCells = parseTableCells(bodyLines[i + 1]);
        const alignments = alignCells.map(c => {
          const tCell = c.trim();
          if (tCell.startsWith(":") && tCell.endsWith(":")) return "center";
          if (tCell.endsWith(":")) return "right";
          return "left";
        });
        i += 2;
        const rows = [];
        while (i < bodyLines.length && bodyLines[i].trim() && bodyLines[i].includes("|")) {
          rows.push(parseTableCells(bodyLines[i]));
          i++;
        }
        renderedBlocks.push( /*#__PURE__*/React.createElement("div", {
          key: `tbl_${i}`,
          className: "my-3.5 overflow-x-auto rounded-xl border shadow-sm"
        }, /*#__PURE__*/React.createElement("table", {
          className: "w-full border-collapse text-xs"
        }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
          className: "bg-muted/60 border-b text-brand-primary font-semibold"
        }, headerCells.map((cell, cIdx) => /*#__PURE__*/React.createElement("th", {
          key: cIdx,
          style: {
            textAlign: alignments[cIdx] || "left"
          },
          className: "px-3.5 py-2.5 border-r last:border-r-0"
        }, renderInline(cell, `th_${i}_${cIdx}`))))), /*#__PURE__*/React.createElement("tbody", {
          className: "divide-y"
        }, rows.map((row, rIdx) => /*#__PURE__*/React.createElement("tr", {
          key: rIdx,
          className: "hover:bg-muted/30 transition-colors"
        }, headerCells.map((_h, cIdx) => /*#__PURE__*/React.createElement("td", {
          key: cIdx,
          style: {
            textAlign: alignments[cIdx] || "left"
          },
          className: "px-3.5 py-2 border-r last:border-r-0"
        }, renderInline(row[cIdx] || "", `td_${i}_${rIdx}_${cIdx}`)))))))));
        continue;
      }
      if (trimmed.startsWith(">")) {
        const quoteLines = [];
        while (i < bodyLines.length && bodyLines[i].trim().startsWith(">")) {
          quoteLines.push(bodyLines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        const alertMatch = quoteLines[0]?.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(.*))?$/i);
        if (alertMatch) {
          const alertType = alertMatch[1].toUpperCase();
          const customTitle = alertMatch[2] || "";
          renderedBlocks.push(renderAdmonition(alertType, customTitle, quoteLines.slice(1), `alert_${i}`, renderInline, isEn));
        } else {
          renderedBlocks.push( /*#__PURE__*/React.createElement("blockquote", {
            key: `bq_${i}`,
            className: "my-3 border-l-4 border-brand-secondary/60 bg-muted/30 rounded-r-xl pl-4 pr-3 py-2 text-muted-foreground italic space-y-1"
          }, quoteLines.map((ql, qIdx) => /*#__PURE__*/React.createElement("p", {
            key: qIdx
          }, renderInline(ql, `bq_${i}_${qIdx}`)))));
        }
        continue;
      }
      if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
        const listItems = [];
        while (i < bodyLines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(bodyLines[i])) {
          const rawL = bodyLines[i];
          const indentMatch = rawL.match(/^(\s*)/);
          const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
          const orderedMatch = rawL.match(/^\s*(\d+)\.\s+(.*)$/);
          const unorderedMatch = rawL.match(/^\s*[-*+]\s+(.*)$/);
          const itemBody = orderedMatch ? orderedMatch[2] : unorderedMatch ? unorderedMatch[1] : rawL;
          const taskMatch = itemBody.match(/^\[([ xX])\]\s+(.*)$/);
          listItems.push({
            indent,
            ordered: Boolean(orderedMatch),
            orderNum: orderedMatch ? orderedMatch[1] : undefined,
            taskState: taskMatch ? taskMatch[1].toLowerCase() === "x" ? "checked" : "unchecked" : null,
            text: taskMatch ? taskMatch[2] : itemBody
          });
          i++;
        }
        renderedBlocks.push( /*#__PURE__*/React.createElement("div", {
          key: `list_${i}`,
          className: "my-2.5 space-y-1.5"
        }, listItems.map((li, lIdx) => /*#__PURE__*/React.createElement("div", {
          key: lIdx,
          style: {
            paddingLeft: `${li.indent * 18}px`
          },
          className: "flex items-start gap-2 leading-relaxed"
        }, li.taskState !== null ? /*#__PURE__*/React.createElement("span", {
          className: `mt-1 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${li.taskState === "checked" ? "bg-emerald-600 border-emerald-600 text-white" : "border-muted-foreground/40 bg-white"}`
        }, li.taskState === "checked" && /*#__PURE__*/React.createElement(Check, {
          className: "w-3 h-3"
        })) : li.ordered ? /*#__PURE__*/React.createElement("span", {
          className: "text-brand-secondary font-mono text-xs font-semibold min-w-[1.25rem] pt-0.5 shrink-0"
        }, li.orderNum, ".") : /*#__PURE__*/React.createElement("span", {
          className: "w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0 ml-1"
        }), /*#__PURE__*/React.createElement("span", {
          className: `flex-1 ${li.taskState === "checked" ? "line-through text-muted-foreground" : ""}`
        }, renderInline(li.text, `li_${i}_${lIdx}`))))));
        continue;
      }
      if (i + 1 < bodyLines.length && /^:\s+.+/.test(bodyLines[i + 1])) {
        const term = bodyLines[i].trim();
        i++;
        const defs = [];
        while (i < bodyLines.length && /^:\s+.+/.test(bodyLines[i])) {
          defs.push(bodyLines[i].replace(/^:\s+/, "").trim());
          i++;
        }
        renderedBlocks.push( /*#__PURE__*/React.createElement("dl", {
          key: `dl_${i}`,
          className: "my-2.5 pl-3 border-l-2 border-brand-primary/30"
        }, /*#__PURE__*/React.createElement("dt", {
          className: "font-bold text-brand-primary"
        }, renderInline(term, `dt_${i}`)), defs.map((d, dIdx) => /*#__PURE__*/React.createElement("dd", {
          key: dIdx,
          className: "ml-4 mt-0.5 text-muted-foreground"
        }, renderInline(d, `dd_${i}_${dIdx}`)))));
        continue;
      }
      renderedBlocks.push( /*#__PURE__*/React.createElement("p", {
        key: `p_${i}`,
        className: "my-2 leading-relaxed"
      }, renderInline(line, `p_${i}`)));
      i++;
    }
    return {
      elements: renderedBlocks,
      headings: tocList,
      footnotes: Array.from(footnoteMap.entries())
    };
  }, [content, basePath, isEn]);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col lg:flex-row gap-4 text-sm text-foreground"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 space-y-1"
  }, elements, footnotes.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-3 border-t text-xs text-muted-foreground space-y-1.5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-foreground"
  }, t("脚注引用", "Footnotes")), footnotes.map(([fnId, fnText]) => /*#__PURE__*/React.createElement("div", {
    key: fnId,
    id: `fn-def-${fnId}`,
    className: "flex items-start gap-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: `#fn-ref-${fnId}`,
    className: "font-mono text-brand-primary font-semibold hover:underline shrink-0"
  }, "[", fnId, "]"), /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }, fnText))))), showToc && headings.length >= 2 && /*#__PURE__*/React.createElement("aside", {
    className: "lg:w-52 shrink-0 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-3 select-none"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTocCollapsed(c => !c),
    className: "flex items-center justify-between w-full text-xs font-semibold text-brand-primary mb-2 hover:opacity-80"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(ListTree, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t(`文档大纲 (${headings.length})`, `Outline (${headings.length})`)), tocCollapsed ? /*#__PURE__*/React.createElement(ChevronRight, {
    className: "w-3.5 h-3.5"
  }) : /*#__PURE__*/React.createElement(ChevronDown, {
    className: "w-3.5 h-3.5"
  })), !tocCollapsed && /*#__PURE__*/React.createElement("nav", {
    className: "space-y-1 max-h-72 overflow-y-auto pr-1"
  }, headings.map(h => /*#__PURE__*/React.createElement("a", {
    key: h.id,
    href: `#${h.id}`,
    onClick: e => {
      e.preventDefault();
      const el = document.getElementById(h.id);
      el?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    style: {
      paddingLeft: `${Math.max(0, h.level - 1) * 10}px`
    },
    className: "block text-xs text-muted-foreground hover:text-brand-primary truncate py-0.5 transition-colors",
    title: h.text
  }, h.text)))));
}
function renderAdmonition(type, customTitle, lines, key, renderInline, isEn = false) {
  const styles = {
    NOTE: {
      label: isEn ? "Note" : "提示 (Note)",
      box: "bg-blue-50/80 border-blue-300 text-blue-950",
      titleColor: "text-blue-700",
      icon: /*#__PURE__*/React.createElement(Info, {
        className: "w-4 h-4 text-blue-600 shrink-0"
      })
    },
    TIP: {
      label: isEn ? "Tip" : "技巧 (Tip)",
      box: "bg-emerald-50/80 border-emerald-300 text-emerald-950",
      titleColor: "text-emerald-700",
      icon: /*#__PURE__*/React.createElement(Lightbulb, {
        className: "w-4 h-4 text-emerald-600 shrink-0"
      })
    },
    IMPORTANT: {
      label: isEn ? "Important" : "重要 (Important)",
      box: "bg-purple-50/80 border-purple-300 text-purple-950",
      titleColor: "text-purple-700",
      icon: /*#__PURE__*/React.createElement(Sparkles, {
        className: "w-4 h-4 text-purple-600 shrink-0"
      })
    },
    WARNING: {
      label: isEn ? "Warning" : "警告 (Warning)",
      box: "bg-amber-50/80 border-amber-300 text-amber-950",
      titleColor: "text-amber-700",
      icon: /*#__PURE__*/React.createElement(AlertTriangle, {
        className: "w-4 h-4 text-amber-600 shrink-0"
      })
    },
    CAUTION: {
      label: isEn ? "Caution" : "危险 (Caution)",
      box: "bg-rose-50/80 border-rose-300 text-rose-950",
      titleColor: "text-rose-700",
      icon: /*#__PURE__*/React.createElement(AlertOctagon, {
        className: "w-4 h-4 text-rose-600 shrink-0"
      })
    },
    DANGER: {
      label: isEn ? "Danger" : "危险 (Danger)",
      box: "bg-rose-50/80 border-rose-300 text-rose-950",
      titleColor: "text-rose-700",
      icon: /*#__PURE__*/React.createElement(AlertOctagon, {
        className: "w-4 h-4 text-rose-600 shrink-0"
      })
    }
  };
  const cfg = styles[type] || styles.NOTE;
  return /*#__PURE__*/React.createElement("div", {
    key: key,
    className: `my-3 p-3.5 rounded-xl border-l-4 border ${cfg.box} space-y-1.5`
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 font-semibold text-xs ${cfg.titleColor}`
  }, cfg.icon, /*#__PURE__*/React.createElement("span", null, customTitle || cfg.label)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs leading-relaxed space-y-1"
  }, lines.map((l, idx) => /*#__PURE__*/React.createElement("p", {
    key: idx
  }, renderInline(l, `${key}_${idx}`)))));
}
const MAX_TEXT_BYTES = 256 * 1024;
const MAX_EDITABLE_BYTES = 5 * 1024 * 1024;
function decodeTextBytesSmart(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return {
      text: new TextDecoder("utf-8").decode(bytes.subarray(3)),
      charset: "UTF-8"
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return {
      text: new TextDecoder("utf-16le").decode(bytes.subarray(2)),
      charset: "UTF-16LE"
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return {
      text: new TextDecoder("utf-16be").decode(bytes.subarray(2)),
      charset: "UTF-16BE"
    };
  }
  try {
    const strictUtf8 = new TextDecoder("utf-8", {
      fatal: true
    }).decode(bytes);
    return {
      text: strictUtf8,
      charset: "UTF-8"
    };
  } catch {
    try {
      const gbText = new TextDecoder("gb18030", {
        fatal: false
      }).decode(bytes);
      return {
        text: gbText,
        charset: "GB18030"
      };
    } catch {
      return {
        text: new TextDecoder("utf-8", {
          fatal: false
        }).decode(bytes),
        charset: "UTF-8"
      };
    }
  }
}
function PreviewModal() {
  const queryClient = useQueryClient();
  const item = useFileStore(s => s.previewFile);
  const previewAutoEdit = useFileStore(s => s.previewAutoEdit);
  const setPreviewFile = useFileStore(s => s.setPreviewFile);
  const viewMode = useFileStore(s => s.viewMode);
  const currentPath = useFileStore(s => s.currentPath);
  const searchQuery = useFileStore(s => s.searchQuery);
  const showToast = useFileStore(s => s.showToast);
  const openConfirm = useFileStore(s => s.openConfirm);
  const {
    t
  } = useI18n();
  const [textContent, setTextContent] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [detectedCharset, setDetectedCharset] = useState("UTF-8");
  const [loadedModifiedTime, setLoadedModifiedTime] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [savingText, setSavingText] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isBinaryDetected, setIsBinaryDetected] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mdMode, setMdMode] = useState("render");
  const [editSplitPreview, setEditSplitPreview] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const viewerRef = useRef(null);
  const textareaRef = useRef(null);
  const audioRef = useRef(null);
  const kind = item ? getPreviewKind(item.name) : null;
  const isMarkdown = item ? ["md", "markdown"].includes(getFileExtension(item.name)) : false;
  const previewUrl = item ? getPreviewUrl(item.path) : "";
  const downloadUrl = item ? getDownloadUrl(item.path) : "";
  const fullActive = isFullscreen || isNativeFullscreen;
  const previewableSiblings = useMemo(() => {
    const key = ["files", viewMode, viewMode === "search" ? searchQuery : currentPath];
    const cached = queryClient.getQueryData(key) || [];
    return cached.filter(f => !f.isDirectory && isPreviewable(f.name));
  }, [queryClient, viewMode, currentPath, searchQuery, item]);
  const currentIndex = useMemo(() => {
    if (!item) return -1;
    return previewableSiblings.findIndex(f => f.path === item.path);
  }, [item, previewableSiblings]);
  const hasPrev = !isEditing && currentIndex > 0;
  const hasNext = !isEditing && currentIndex >= 0 && currentIndex < previewableSiblings.length - 1;
  const goPrev = useCallback(() => {
    if (hasPrev) setPreviewFile(previewableSiblings[currentIndex - 1]);
  }, [hasPrev, previewableSiblings, currentIndex, setPreviewFile]);
  const goNext = useCallback(() => {
    if (hasNext) setPreviewFile(previewableSiblings[currentIndex + 1]);
  }, [hasNext, previewableSiblings, currentIndex, setPreviewFile]);
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const next = !prev;
      if (!next && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  }, []);
  const toggleNativeFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const targetEl = viewerRef.current || document.documentElement;
        await targetEl.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen(v => !v);
    }
  }, []);
  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsNativeFullscreen(active);
      if (active) setIsFullscreen(true);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);
  const startEditing = useCallback(async () => {
    if (!item) return;
    if ((item.size || 0) > MAX_EDITABLE_BYTES) {
      showToast(t("文件超过 5 MB，不支持在线编辑，请下载后修改", "File exceeds 5 MB limit for online editing; please download to edit"), "error");
      return;
    }
    setLoadingText(true);
    try {
      const res = await api.getFileContent(item.path);
      setTextContent(res.content);
      setEditContent(res.content);
      setDetectedCharset(res.charset || "UTF-8");
      setLoadedModifiedTime(res.modifiedTime);
      setIsTruncated(false);
      setIsEditing(true);
    } catch (err) {
      showToast(err.message || t("无法进入在线编辑模式", "Failed to enter online edit mode"), "error");
    } finally {
      setLoadingText(false);
    }
  }, [item, showToast, t]);
  const performSaveEdit = useCallback(async (forceOverwrite = false) => {
    if (!item || savingText) return;
    setSavingText(true);
    try {
      const res = await api.saveFileContent(item.path, editContent, forceOverwrite ? undefined : loadedModifiedTime, detectedCharset);
      setTextContent(editContent);
      setLoadedModifiedTime(res.file.modifiedTime);
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      queryClient.invalidateQueries({
        queryKey: ["quota"]
      });
      const selected = useFileStore.getState().selectedFile;
      if (selected && selected.path === item.path) {
        useFileStore.getState().setSelectedFile({
          ...selected,
          size: res.file.size,
          modifiedTime: res.file.modifiedTime
        });
      }
      showToast(t("文本内容已成功保存", "File content saved successfully"), "success");
    } catch (err) {
      if (err?.status === 409) {
        openConfirm({
          title: t("检测到文件并发修改冲突", "Concurrent Edit Conflict Detected"),
          description: t("该文件在您编辑期间已被其他窗口或上传任务修改。是否仍要以当前编辑器内容强制覆盖保存？", "This file was modified by another session while you were editing. Overwrite with your current changes?"),
          confirmText: t("强制覆盖保存", "Overwrite & Save"),
          destructive: true,
          onConfirm: () => {
            performSaveEdit(true);
          }
        });
      } else {
        showToast(err.message || t("保存文件失败", "Failed to save file"), "error");
      }
    } finally {
      setSavingText(false);
    }
  }, [item, editContent, savingText, loadedModifiedTime, detectedCharset, queryClient, showToast, openConfirm, t]);
  useEffect(() => {
    setPreviewFailed(false);
    setIsBinaryDetected(false);
    setIsEditing(false);
    setZoom(1);
    setRotation(0);
    setMdMode("render");
    setAudioRate(1);
    if (!item) {
      setIsFullscreen(false);
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [item]);
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = e => {
      if (isEditing) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          performSaveEdit(false);
        }
        return;
      }
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        goNext();
      } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, isEditing, hasPrev, hasNext, goPrev, goNext, performSaveEdit, toggleFullscreen]);
  useEffect(() => {
    if (item && kind === "text") {
      setLoadingText(true);
      setIsTruncated(false);
      setIsBinaryDetected(false);
      setTextContent(null);
      if (previewAutoEdit && (item.size || 0) <= MAX_EDITABLE_BYTES) {
        api.getFileContent(item.path).then(res => {
          setTextContent(res.content);
          setEditContent(res.content);
          setDetectedCharset(res.charset || "UTF-8");
          setLoadedModifiedTime(res.modifiedTime);
          setIsEditing(true);
          setLoadingText(false);
        }).catch(err => {
          showToast(err.message || t("无法加载可编辑文本", "Failed to load editable text"), "error");
          setIsBinaryDetected(true);
          setLoadingText(false);
        });
        return;
      }
      if (item.size === 0) {
        setTextContent("");
        setEditContent("");
        setDetectedCharset("UTF-8");
        setIsTruncated(false);
        setLoadingText(false);
        return;
      }
      fetch(previewUrl, {
        headers: {
          Range: `bytes=0-${MAX_TEXT_BYTES - 1}`
        }
      }).then(async r => {
        if (!r.ok) throw new Error("Failed to load text");
        const contentRange = r.headers.get("Content-Range") || "";
        const match = contentRange.match(/\/(\d+)$/);
        const totalBytes = match ? Number(match[1]) : item.size ?? 0;
        const truncated = (item.size ?? 0) > MAX_TEXT_BYTES || totalBytes > MAX_TEXT_BYTES;
        const buf = await r.arrayBuffer();
        const bytes = new Uint8Array(buf);
        const checkLen = Math.min(bytes.length, 8192);
        const isUtf16Bom = checkLen >= 2 && (bytes[0] === 0xff && bytes[1] === 0xfe || bytes[0] === 0xfe && bytes[1] === 0xff);
        if (!isUtf16Bom) {
          for (let i = 0; i < checkLen; i++) {
            if (bytes[i] === 0) {
              return {
                text: "",
                charset: "UTF-8",
                truncated: false,
                binary: true
              };
            }
          }
        }
        const {
          text: raw,
          charset
        } = decodeTextBytesSmart(bytes);
        return {
          text: truncated ? raw.replace(/\uFFFD+$/, "") : raw,
          charset,
          truncated,
          binary: false
        };
      }).then(({
        text,
        charset,
        truncated,
        binary
      }) => {
        if (binary) {
          setIsBinaryDetected(true);
        } else {
          setTextContent(text);
          setEditContent(text);
          setDetectedCharset(charset);
          setIsTruncated(truncated);
        }
        setLoadingText(false);
      }).catch(() => {
        setTextContent(t("加载文本内容失败", "Failed to load text content"));
        setLoadingText(false);
      });
    } else {
      setTextContent(null);
    }
  }, [item, kind, previewUrl, previewAutoEdit, showToast, t]);
  const handleDownload = () => {
    if (!item) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleCopyText = async () => {
    const val = isEditing ? editContent : textContent || "";
    if (await copyToClipboard(val)) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1800);
    }
  };
  const insertMarkdownSnippet = (prefix, suffix = "", defaultText = "") => {
    const el = textareaRef.current;
    if (!el) {
      setEditContent(prev => prev + prefix + defaultText + suffix);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = editContent.substring(start, end) || defaultText;
    const nextVal = editContent.substring(0, start) + prefix + selected + suffix + editContent.substring(end);
    setEditContent(nextVal);
    setTimeout(() => {
      el.focus();
      el.selectionStart = start + prefix.length;
      el.selectionEnd = start + prefix.length + selected.length;
    }, 0);
  };
  const handleEditorKeyDown = e => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextVal = editContent.substring(0, start) + "  " + editContent.substring(end);
      setEditContent(nextVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };
  const isDirty = isEditing && editContent !== (textContent ?? "");
  const fallbackBlock = /*#__PURE__*/React.createElement("div", {
    className: "text-center p-8 space-y-3"
  }, /*#__PURE__*/React.createElement(FileText, {
    className: "w-16 h-16 text-muted-foreground/40 mx-auto"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-foreground"
  }, isBinaryDetected ? t("检测到该文件包含二进制数据，无法作为纯文本预览或编辑", "Binary content detected; cannot preview or edit as plain text") : previewFailed ? t("该文件在线预览加载失败，请下载后查看", "Online preview failed to load; please download to view") : t("该文件格式暂不支持在线直接预览", "This file format does not support direct online preview")), /*#__PURE__*/React.createElement(Button, {
    onClick: handleDownload,
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4"
  }), t("立即下载到本地查看", "Download to View")));
  return /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(item),
    onOpenChange: open => !open && setPreviewFile(null)
  }, /*#__PURE__*/React.createElement(DialogContent, {
    ref: viewerRef,
    className: `flex flex-col storeit-modal-spring ${fullActive ? "!w-screen !h-screen !max-w-none !max-h-none !rounded-none !border-0 p-4 sm:p-5" : "max-w-4xl max-h-[88vh] p-6"}`
  }, /*#__PURE__*/React.createElement(DialogHeader, {
    className: "flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3 border-b pr-7 shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-0"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-5 h-5 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-base truncate font-semibold",
    title: item?.name
  }, item?.name), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-muted-foreground whitespace-nowrap"
  }, "(", formatBytes(item?.size || 0), ")"), kind === "text" && !isBinaryDetected && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap"
  }, detectedCharset), isDirty && /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
  }, t("● 未保存修改", "● Unsaved")), !isEditing && previewableSiblings.length > 1 && currentIndex >= 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap"
  }, currentIndex + 1, " / ", previewableSiblings.length)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1.5 shrink-0"
  }, !isEditing && previewableSiblings.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 mr-1"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 w-8 p-0",
    disabled: !hasPrev,
    onClick: goPrev,
    title: t("上一个文件 (←)", "Previous file (←)")
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 w-8 p-0",
    disabled: !hasNext,
    onClick: goNext,
    title: t("下一个文件 (→)", "Next file (→)")
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    className: "w-4 h-4"
  }))), kind === "text" && !isBinaryDetected && /*#__PURE__*/React.createElement(React.Fragment, null, isEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, isMarkdown && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: editSplitPreview ? "secondary" : "outline",
    className: "gap-1 h-8",
    onClick: () => setEditSplitPreview(v => !v),
    title: t("切换实时分栏渲染预览", "Toggle live split preview")
  }, /*#__PURE__*/React.createElement(Columns, {
    className: "w-3.5 h-3.5"
  }), editSplitPreview ? t("分栏预览中", "Split On") : t("开启分栏", "Split View")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "default",
    className: "gap-1.5 h-8",
    disabled: savingText,
    onClick: () => performSaveEdit(false),
    title: t("保存文本修改 (Ctrl+S)", "Save changes (Ctrl+S)")
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-3.5 h-3.5"
  }), savingText ? t("保存中...", "Saving...") : t("保存", "Save")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "gap-1 h-8",
    onClick: () => {
      setIsEditing(false);
      setEditContent(textContent || "");
    }
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  }), " ", t("取消", "Cancel"))) : /*#__PURE__*/React.createElement(React.Fragment, null, (item?.size || 0) <= MAX_EDITABLE_BYTES && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "gap-1.5 h-8",
    onClick: startEditing
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-3.5 h-3.5 text-brand-secondary"
  }), t("在线编辑", "Edit")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "gap-1 h-8",
    onClick: handleCopyText,
    title: t("复制全部文本", "Copy all text")
  }, copiedText ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    className: "w-3.5 h-3.5 text-emerald-600"
  }), " ", t("已复制", "Copied")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    className: "w-3.5 h-3.5"
  }), " ", t("复制", "Copy"))), (!isMarkdown || mdMode === "raw") && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "h-8 w-8 p-0",
    onClick: () => setWordWrap(w => !w),
    title: wordWrap ? t("切换为横向滚动", "Switch to horizontal scroll") : t("切换为自动换行", "Switch to word wrap")
  }, /*#__PURE__*/React.createElement(WrapText, {
    className: "w-3.5 h-3.5"
  })))), isMarkdown && kind === "text" && !isBinaryDetected && !isEditing && /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center rounded-lg border bg-muted/40 p-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMdMode("render"),
    className: `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${mdMode === "render" ? "bg-white text-brand-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "w-3 h-3"
  }), " ", t("渲染", "Render")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMdMode("split"),
    className: `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${mdMode === "split" ? "bg-white text-brand-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`
  }, /*#__PURE__*/React.createElement(Columns, {
    className: "w-3 h-3"
  }), " ", t("分栏", "Split")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMdMode("raw"),
    className: `inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${mdMode === "raw" ? "bg-white text-brand-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`
  }, /*#__PURE__*/React.createElement(Code, {
    className: "w-3 h-3"
  }), " ", t("源码", "Source"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "gap-1 h-8",
    onClick: toggleFullscreen,
    onDoubleClick: toggleNativeFullscreen,
    title: fullActive ? t("退出全屏模式 (快捷键 F)", "Exit fullscreen (F)") : t("铺满全屏预览 (快捷键 F，双击进入系统级全屏)", "Fullscreen (F, double-click for native fullscreen)")
  }, fullActive ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Minimize2, {
    className: "w-3.5 h-3.5"
  }), " ", t("退出全屏", "Exit Fullscreen")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Maximize2, {
    className: "w-3.5 h-3.5"
  }), " ", t("全屏", "Fullscreen"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "gap-1.5 h-8",
    onClick: handleDownload
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3.5 h-3.5"
  }), " ", t("下载", "Download")))), /*#__PURE__*/React.createElement("div", {
    className: `relative flex-1 overflow-auto flex items-center justify-center p-2 bg-black/5 rounded-xl mt-3 transition-all duration-200 ${fullActive ? "min-h-0 h-full" : "min-h-[340px]"}`
  }, kind === "image" && !previewFailed && /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col items-center justify-center w-full h-full overflow-hidden",
    onWheel: e => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        setZoom(z => Math.min(5, Math.max(0.25, +(z + delta).toFixed(2))));
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `overflow-auto max-w-full flex items-center justify-center p-4 ${fullActive ? "h-[calc(100vh-140px)]" : "max-h-[62vh]"}`
  }, /*#__PURE__*/React.createElement("img", {
    src: previewUrl,
    alt: item?.name,
    onDoubleClick: () => setZoom(z => z === 1 ? 2 : 1),
    style: {
      transform: `scale(${zoom}) rotate(${rotation}deg)`,
      transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
    },
    className: `${fullActive ? "max-h-[calc(100vh-160px)]" : "max-h-[58vh]"} max-w-full object-contain rounded-lg shadow-sm cursor-zoom-in`,
    onError: () => setPreviewFailed(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur border shadow-md text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2))),
    className: "p-1 hover:bg-black/5 rounded transition-colors",
    title: t("缩小", "Zoom out")
  }, /*#__PURE__*/React.createElement(ZoomOut, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setZoom(1);
      setRotation(0);
    },
    className: "px-1.5 font-mono text-[11px] hover:bg-black/5 rounded",
    title: t("点击复位 100% (双击图片快速放大)", "Reset 100% (double-click image to zoom)")
  }, Math.round(zoom * 100), "%"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setZoom(z => Math.min(5, +(z + 0.25).toFixed(2))),
    className: "p-1 hover:bg-black/5 rounded transition-colors",
    title: t("放大", "Zoom in")
  }, /*#__PURE__*/React.createElement(ZoomIn, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-black/20"
  }, "|"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setRotation(r => (r + 90) % 360),
    className: "p-1 hover:bg-black/5 rounded transition-colors",
    title: t("顺时针旋转 90°", "Rotate 90°")
  }, /*#__PURE__*/React.createElement(RotateCw, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-black/20"
  }, "|"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggleNativeFullscreen,
    className: "p-1 hover:bg-black/5 rounded transition-colors",
    title: t("切换浏览器系统全屏", "Toggle native browser fullscreen")
  }, isNativeFullscreen ? /*#__PURE__*/React.createElement(Minimize2, {
    className: "w-3.5 h-3.5"
  }) : /*#__PURE__*/React.createElement(Maximize2, {
    className: "w-3.5 h-3.5"
  })))), kind === "video" && !previewFailed && /*#__PURE__*/React.createElement("video", {
    src: previewUrl,
    controls: true,
    autoPlay: true,
    className: `${fullActive ? "h-[calc(100vh-115px)] w-full bg-black" : "max-h-[62vh] max-w-full"} rounded-lg shadow-sm object-contain`,
    onError: () => setPreviewFailed(true)
  }), kind === "audio" && !previewFailed && /*#__PURE__*/React.createElement("div", {
    className: `p-8 w-full ${fullActive ? "max-w-xl" : "max-w-md"} bg-white rounded-2xl shadow-sm text-center space-y-5 border`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center mx-auto shadow-md"
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-8 h-8"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-base font-semibold text-brand-primary break-all"
  }, item?.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mt-1"
  }, formatBytes(item?.size || 0))), /*#__PURE__*/React.createElement("audio", {
    ref: audioRef,
    src: previewUrl,
    controls: true,
    autoPlay: true,
    className: "w-full",
    onError: () => setPreviewFailed(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
  }, /*#__PURE__*/React.createElement("span", null, t("倍速:", "Speed:")), [0.75, 1, 1.25, 1.5, 2].map(rate => /*#__PURE__*/React.createElement("button", {
    key: rate,
    type: "button",
    onClick: () => {
      setAudioRate(rate);
      if (audioRef.current) audioRef.current.playbackRate = rate;
    },
    className: `px-2 py-0.5 rounded-md transition-colors ${audioRate === rate ? "bg-brand-primary text-white font-semibold" : "bg-muted hover:bg-black/10 text-foreground"}`
  }, rate, "x")))), kind === "pdf" && !previewFailed && /*#__PURE__*/React.createElement("iframe", {
    src: previewUrl,
    className: `w-full ${fullActive ? "h-[calc(100vh-110px)]" : "h-[64vh]"} rounded-lg border bg-white`,
    title: item?.name
  }), kind === "text" && !isBinaryDetected && /*#__PURE__*/React.createElement("div", {
    className: `w-full ${fullActive ? "h-[calc(100vh-110px)]" : "h-[64vh]"} flex flex-col rounded-xl overflow-hidden border ${!isEditing && isMarkdown && mdMode === "render" ? "bg-white text-foreground p-5" : !isEditing && isMarkdown && mdMode === "split" ? "bg-white text-foreground p-0" : isEditing && isMarkdown && editSplitPreview ? "bg-[#1e1e2e] text-[#cdd6f4] p-0" : "bg-[#1e1e2e] text-[#cdd6f4] font-mono p-4"} text-xs leading-relaxed`
  }, isTruncated && !isEditing && /*#__PURE__*/React.createElement("div", {
    className: "mb-2 p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 text-[11px] flex items-center justify-between gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-3.5 h-3.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, t("内容过大，预览仅加载前 256 KB 内容。", "File is large; preview shows the first 256 KB."))), (item?.size || 0) <= MAX_EDITABLE_BYTES && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: startEditing,
    className: "px-2.5 py-0.5 rounded bg-brand-primary text-white font-semibold hover:opacity-90"
  }, t("加载完整文件并编辑", "Load Full File & Edit"))), isEditing && isMarkdown && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1 px-3 py-1.5 bg-[#181825] border-b border-white/10 text-[11px] text-[#cdd6f4] shrink-0 select-none"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("## ", "", t("二级标题", "Heading 2")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 font-semibold",
    title: t("插入标题", "Insert Heading")
  }, "H2"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("**", "**", t("加粗文本", "bold text")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 font-bold",
    title: t("加粗", "Bold")
  }, "B"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("*", "*", t("斜体文本", "italic text")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 italic",
    title: t("斜体", "Italic")
  }, "I"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("~~", "~~", t("删除线", "strikethrough")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 line-through",
    title: t("删除线", "Strikethrough")
  }, "S"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("==", "==", t("高亮重点", "highlight")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 text-amber-300",
    title: t("高亮标记 ==text==", "Highlight ==text==")
  }, t("==高亮==", "==Mark==")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("`", "`", "code"),
    className: "px-2 py-0.5 rounded hover:bg-white/10 font-mono",
    title: t("行内代码", "Inline code")
  }, t("`代码`", "`code`")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("\n```js\n", "\n```\n", "console.log('hello');"),
    className: "px-2 py-0.5 rounded hover:bg-white/10 font-mono",
    title: t("代码块", "Code block")
  }, t("代码块", "Code Block")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("\n- [ ] ", "", t("待办事项", "Todo item")),
    className: "px-2 py-0.5 rounded hover:bg-white/10",
    title: t("任务列表", "Task list")
  }, t("[x] 任务", "[x] Task")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet(t("\n| 列1 | 列2 | 列3 |\n| :--- | :---: | ---: |\n| ", "\n| Col 1 | Col 2 | Col 3 |\n| :--- | :---: | ---: |\n| "), t(" | 数据2 | 100 |\n", " | Data 2 | 100 |\n"), t("数据1", "Data 1")),
    className: "px-2 py-0.5 rounded hover:bg-white/10",
    title: t("插入 GFM 表格", "Insert GFM Table")
  }, t("表格", "Table")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("\n> [!NOTE]\n> ", "\n", t("在此输入提示说明内容", "Enter callout note here")),
    className: "px-2 py-0.5 rounded hover:bg-white/10 text-sky-300",
    title: t("插入 GitHub 风格提示块 [!NOTE]", "Insert GitHub Alert [!NOTE]")
  }, "[!NOTE]"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("$$", "$$", "\\sum_{i=1}^{n} x_i"),
    className: "px-2 py-0.5 rounded hover:bg-white/10 font-serif italic",
    title: t("插入数学公式", "Insert Math Formula")
  }, t("∑ 公式", "∑ Math")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => insertMarkdownSnippet("[", "](https://example.com)", t("链接文字", "link text")),
    className: "px-2 py-0.5 rounded hover:bg-white/10",
    title: t("插入超链接", "Insert Link")
  }, t("链接", "Link"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto flex flex-col min-h-0"
  }, loadingText ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center h-full gap-2 text-muted-foreground"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-4 h-4 animate-spin"
  }), t("加载中...", "Loading...")) : isEditing ? isMarkdown && editSplitPreview ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-0 h-full"
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: textareaRef,
    autoFocus: true,
    value: editContent,
    onChange: e => setEditContent(e.target.value),
    onKeyDown: handleEditorKeyDown,
    spellCheck: false,
    className: "w-full h-full p-4 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs leading-relaxed outline-none resize-none selection:bg-brand-secondary/40 overflow-auto",
    placeholder: t("在此输入 Markdown 内容（右侧实时预览渲染效果）...", "Write Markdown here (live preview on the right)...")
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full p-5 bg-white text-foreground overflow-auto"
  }, /*#__PURE__*/React.createElement(MarkdownRenderer, {
    content: editContent,
    basePath: item?.path,
    showToc: false
  }))) : /*#__PURE__*/React.createElement("textarea", {
    ref: textareaRef,
    autoFocus: true,
    value: editContent,
    onChange: e => setEditContent(e.target.value),
    onKeyDown: handleEditorKeyDown,
    spellCheck: false,
    className: "w-full flex-1 bg-transparent text-[#cdd6f4] font-mono text-xs leading-relaxed outline-none resize-none selection:bg-brand-secondary/40",
    placeholder: t("在此输入文本内容（支持 Tab 缩进与 Ctrl+S 快捷保存）...", "Type text here (supports Tab indent & Ctrl+S to save)...")
  }) : isMarkdown && mdMode === "render" ? /*#__PURE__*/React.createElement(MarkdownRenderer, {
    content: textContent || "",
    basePath: item?.path,
    showToc: true
  }) : isMarkdown && mdMode === "split" ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x min-h-0 h-full"
  }, /*#__PURE__*/React.createElement("pre", {
    className: "p-4 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-auto whitespace-pre-wrap break-words"
  }, textContent), /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-white text-foreground overflow-auto"
  }, /*#__PURE__*/React.createElement(MarkdownRenderer, {
    content: textContent || "",
    basePath: item?.path,
    showToc: false
  }))) : /*#__PURE__*/React.createElement("pre", {
    className: wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
  }, textContent))), kind === null || previewFailed || isBinaryDetected ? fallbackBlock : null)));
}
function UploadConflictModal() {
  const conflict = useFileStore(s => s.uploadConflict);
  const setUploadConflict = useFileStore(s => s.setUploadConflict);
  const showToast = useFileStore(s => s.showToast);
  const addFile = useUploadStore(s => s.addFile);
  const queryClient = useQueryClient();
  const {
    t
  } = useI18n();
  const [folderStrategy, setFolderStrategy] = useState("merge");
  const [fileStrategy, setFileStrategy] = useState("rename");
  const [processing, setProcessing] = useState(false);
  if (!conflict) return null;
  const hasFolderConflicts = conflict.conflictingFolders.length > 0;
  const hasFileConflicts = conflict.conflictingFiles.length > 0 || hasFolderConflicts && folderStrategy === "merge";
  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const folderRenameMap = new Map();
      for (const folderName of conflict.conflictingFolders) {
        const res = await api.resolveFolderConflict(conflict.targetDir, folderName, folderStrategy);
        folderRenameMap.set(folderName, res.folderName);
      }
      const remapSubPath = subPath => {
        if (!subPath) return "";
        const parts = subPath.split("/");
        const top = parts[0];
        if (folderRenameMap.has(top)) {
          parts[0] = folderRenameMap.get(top);
        }
        return parts.join("/");
      };
      for (const emptySub of conflict.emptyDirs) {
        const mapped = remapSubPath(emptySub);
        try {
          await api.createDirectory(conflict.targetDir, mapped);
        } catch {}
      }
      for (const entry of conflict.entries) {
        const mappedSub = remapSubPath(entry.subPath);
        const destDir = mappedSub ? conflict.targetDir ? `${conflict.targetDir}/${mappedSub}` : mappedSub : conflict.targetDir;
        await addFile(entry.file, destDir, fileStrategy);
      }
      queryClient.invalidateQueries({
        queryKey: ["files"]
      });
      setUploadConflict(null);
    } catch (err) {
      showToast(err.message || t("处理上传冲突失败", "Failed to resolve upload conflicts"), "error");
    } finally {
      setProcessing(false);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(conflict),
    onOpenChange: open => !open && setUploadConflict(null)
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-5 h-5 text-amber-500"
  }), t("检测到同名文件或文件夹冲突", "Name Conflict Detected"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, t("目标目录 ", "Target directory "), /*#__PURE__*/React.createElement("code", {
    className: "bg-muted px-1.5 py-0.5 rounded font-mono"
  }, "/", conflict.targetDir || t("根目录", "root")), t(" 中已存在同名项目，请选择处理方式：", " already contains items with the same name. Choose how to proceed:")), hasFolderConflicts && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl border bg-muted/20 space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-foreground"
  }, t("同名文件夹", "Conflicting Folders"), " (", conflict.conflictingFolders.join(", "), "):"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    key: "merge",
    label: t("合并目录", "Merge"),
    desc: t("保留现有目录并传入内部", "Keep folder & upload inside")
  }, {
    key: "rename",
    label: t("自动重命名", "Auto Rename"),
    desc: t("新建 文件夹 (1)", "Create Folder (1)")
  }, {
    key: "overwrite",
    label: t("覆盖原目录", "Overwrite"),
    desc: t("清空旧目录后写入", "Replace existing folder")
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.key,
    type: "button",
    onClick: () => setFolderStrategy(opt.key),
    className: `p-2 rounded-xl border text-left transition-all ${folderStrategy === opt.key ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "bg-white hover:bg-black/5 text-foreground"}`
  }, /*#__PURE__*/React.createElement("div", null, opt.label), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-muted-foreground font-normal mt-0.5"
  }, opt.desc))))), hasFileConflicts && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl border bg-muted/20 space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-foreground"
  }, conflict.conflictingFiles.length > 0 ? `${t("同名文件", "Conflicting Files")} (${conflict.conflictingFiles.slice(0, 3).join(", ")}${conflict.conflictingFiles.length > 3 ? t(" 等", ", etc.") : ""}):` : t("合并目录内的同名文件处理方式：", "For conflicting files inside merged folders:")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, [{
    key: "rename",
    label: t("自动重命名", "Auto Rename"),
    desc: t("保留两者，如 file (1).ext", "Keep both, e.g. file (1).ext")
  }, {
    key: "overwrite",
    label: t("覆盖同名文件", "Overwrite"),
    desc: t("直接替换已有同名文件", "Replace existing file")
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.key,
    type: "button",
    onClick: () => setFileStrategy(opt.key),
    className: `p-2 rounded-xl border text-left transition-all ${fileStrategy === opt.key ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "bg-white hover:bg-black/5 text-foreground"}`
  }, /*#__PURE__*/React.createElement("div", null, opt.label), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-muted-foreground font-normal mt-0.5"
  }, opt.desc)))))), /*#__PURE__*/React.createElement(DialogFooter, {
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setUploadConflict(null)
  }, t("取消上传", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    disabled: processing,
    onClick: handleConfirm
  }, processing ? t("处理中...", "Processing...") : t("按所选策略开始上传", "Start Upload")))));
}
function ChangePasswordModal() {
  const isOpen = useFileStore(s => s.passwordModalOpen);
  const setOpen = useFileStore(s => s.setPasswordModalOpen);
  const showToast = useFileStore(s => s.showToast);
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const {
    t
  } = useI18n();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast(t("新口令至少需要 8 位字符", "New password must be at least 8 characters"), "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t("两次输入的新口令不一致", "New passwords do not match"), "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.changeOwnPassword(oldPassword, newPassword);
      if (user) {
        setUser({
          ...user,
          mustChangePassword: false
        });
      }
      showToast(t("登录口令已成功修改", "Password updated successfully"), "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err) {
      showToast(err.message || t("修改口令失败", "Failed to update password"), "error");
    } finally {
      setSubmitting(false);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: setOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(KeyRound, {
    className: "w-5 h-5 text-brand-secondary"
  }), t("修改登录口令", "Change Password"))), user?.mustChangePassword && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs"
  }, t("系统检测到您的账号处于待修改初始口令状态，请设置新的个人登录口令。", "Your account requires an initial password change. Please set a new personal password.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("当前原口令", "Current Password")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: oldPassword,
    onChange: e => setOldPassword(e.target.value),
    placeholder: t("请输入当前口令", "Enter current password"),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("新口令 (≥8位)", "New Password (≥ 8 chars)")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: newPassword,
    onChange: e => setNewPassword(e.target.value),
    placeholder: t("至少 8 位字符", "At least 8 characters"),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-medium text-foreground block mb-1"
  }, t("确认新口令", "Confirm New Password")), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    placeholder: t("再次输入新口令", "Re-enter new password"),
    required: true
  })), /*#__PURE__*/React.createElement(DialogFooter, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setOpen(false)
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: submitting
  }, submitting ? t("保存中...", "Saving...") : t("确认修改", "Update Password"))))));
}
function GlobalConfirmModal() {
  const confirmDialog = useFileStore(s => s.confirmDialog);
  const closeConfirm = useFileStore(s => s.closeConfirm);
  const {
    t
  } = useI18n();
  if (!confirmDialog) return null;
  return /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(confirmDialog),
    onOpenChange: open => !open && closeConfirm()
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "sm:max-w-md storeit-modal-spring"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, confirmDialog.title)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground leading-relaxed"
  }, confirmDialog.description), /*#__PURE__*/React.createElement(DialogFooter, {
    className: "gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: closeConfirm
  }, t("取消", "Cancel")), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: confirmDialog.destructive ? "destructive" : "default",
    onClick: () => {
      const fn = confirmDialog.onConfirm;
      closeConfirm();
      fn();
    }
  }, confirmDialog.confirmText || t("确定", "Confirm")))));
}
function GlobalToastList() {
  const toasts = useFileStore(s => s.toasts);
  const dismissToast = useFileStore(s => s.dismissToast);
  if (toasts.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed top-20 right-6 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `storeit-spring-bar pointer-events-auto flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md text-xs font-medium ${t.type === "success" ? "bg-emerald-50/95 text-emerald-800 border-emerald-200" : t.type === "error" ? "bg-rose-50/95 text-rose-800 border-rose-200" : "bg-white/95 text-foreground border-black/10"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-0"
  }, t.type === "success" ? /*#__PURE__*/React.createElement(CheckCircle2, {
    className: "w-4 h-4 text-emerald-600 shrink-0"
  }) : t.type === "error" ? /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-4 h-4 text-rose-600 shrink-0"
  }) : /*#__PURE__*/React.createElement(Info, {
    className: "w-4 h-4 text-brand-secondary shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "break-words"
  }, t.text)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => dismissToast(t.id),
    className: "opacity-60 hover:opacity-100 shrink-0"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3.5 h-3.5"
  })))));
}
function MainPage() {
  const router = useRouter();
  const {
    checkAuth,
    isAuthenticated,
    isLoading,
    user
  } = useAuthStore();
  const viewMode = useFileStore(s => s.viewMode);
  const {
    t
  } = useI18n();

  // Initialize locale (auto-switch to English when browser language is not Chinese)
  useEffect(() => {
    useFileStore.getState().syncLocaleFromBrowser();
    const onLanguageOrFocusChange = () => {
      useFileStore.getState().syncLocaleFromBrowser();
    };
    window.addEventListener("languagechange", onLanguageOrFocusChange);
    window.addEventListener("focus", onLanguageOrFocusChange);
    document.addEventListener("visibilitychange", onLanguageOrFocusChange);
    return () => {
      window.removeEventListener("languagechange", onLanguageOrFocusChange);
      window.removeEventListener("focus", onLanguageOrFocusChange);
      document.removeEventListener("visibilitychange", onLanguageOrFocusChange);
    };
  }, []);

  // URL ↔ ViewMode & Subfolder path sync
  useEffect(() => {
    const VALID_MODES = ["files", "recent", "favorites", "shares", "admin", "settings", "about", "search"];
    if (window.location.pathname === "/about" && !window.location.hash) {
      window.history.replaceState(null, "", "#/about");
      useFileStore.setState({
        viewMode: "about",
        selectedFile: null,
        selectedPaths: []
      });
    }
    const applyLocation = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      if (!rawHash || rawHash === "files") {
        useFileStore.setState({
          viewMode: "files",
          currentPath: "",
          selectedFile: null,
          selectedPaths: []
        });
        return;
      }
      if (rawHash.startsWith("s/")) {
        const shareTok = decodeURIComponent(rawHash.slice(2).split("/")[0] || "");
        if (shareTok) {
          useFileStore.setState({
            viewMode: "shares",
            activeShareToken: shareTok,
            activeShareServerUrl: "",
            selectedFile: null,
            selectedPaths: []
          });
          return;
        }
      }
      if (rawHash.startsWith("files/")) {
        const encodedSub = rawHash.slice("files/".length);
        const decodedPath = encodedSub.split("/").filter(Boolean).map(seg => {
          try {
            return decodeURIComponent(seg);
          } catch {
            return seg;
          }
        }).join("/");
        useFileStore.setState({
          viewMode: "files",
          currentPath: decodedPath,
          selectedFile: null,
          selectedPaths: []
        });
        return;
      }
      if (VALID_MODES.includes(rawHash)) {
        useFileStore.setState({
          viewMode: rawHash,
          selectedFile: null,
          selectedPaths: []
        });
      }
    };
    applyLocation();
    window.addEventListener("popstate", applyLocation);
    return () => window.removeEventListener("popstate", applyLocation);
  }, []);
  useEffect(() => {
    checkAuth().then(loggedIn => {
      if (!loggedIn) {
        router.push("/login");
      }
    });
  }, [checkAuth, router]);
  useEffect(() => {
    if (user?.mustChangePassword) {
      useFileStore.getState().setPasswordModalOpen(true);
    }
  }, [user?.mustChangePassword]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);
  if (isLoading || !isAuthenticated) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center bg-brand-bg text-muted-foreground gap-3"
    }, /*#__PURE__*/React.createElement(RefreshCw, {
      className: "w-8 h-8 animate-spin text-brand-secondary"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-sm"
    }, t("正在加载 StoreIt 存储服务...", "Loading StoreIt storage service...")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-screen overflow-hidden bg-brand-bg"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 overflow-hidden"
  }, /*#__PURE__*/React.createElement(Sidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 flex flex-col overflow-hidden bg-white/40"
  }, /*#__PURE__*/React.createElement(DropZone, null, /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-2 border-b bg-white/30 backdrop-blur-sm shrink-0"
  }, /*#__PURE__*/React.createElement(Breadcrumb, null)), /*#__PURE__*/React.createElement("div", {
    key: viewMode,
    className: "storeit-view-enter flex-1 overflow-y-auto"
  }, viewMode === "files" || viewMode === "recent" || viewMode === "favorites" || viewMode === "search" ? /*#__PURE__*/React.createElement(FileList, null) : viewMode === "shares" ? /*#__PURE__*/React.createElement(SharesTab, null) : viewMode === "admin" ? /*#__PURE__*/React.createElement(UserManagementTab, null) : viewMode === "settings" ? /*#__PURE__*/React.createElement(SettingsTab, null) : viewMode === "about" ? /*#__PURE__*/React.createElement(AboutTab, null) : null)))), /*#__PURE__*/React.createElement(UploadDrawer, null), /*#__PURE__*/React.createElement(GlobalToastList, null), /*#__PURE__*/React.createElement(GlobalConfirmModal, null), /*#__PURE__*/React.createElement(NewFolderModal, null), /*#__PURE__*/React.createElement(NewFileModal, null), /*#__PURE__*/React.createElement(RenameModal, null), /*#__PURE__*/React.createElement(MoveModal, null), /*#__PURE__*/React.createElement(ShareModal, null), /*#__PURE__*/React.createElement(PreviewModal, null), /*#__PURE__*/React.createElement(ChangePasswordModal, null), /*#__PURE__*/React.createElement(UploadConflictModal, null));
}
}},function(e){e.O(0,[261,20,175,819,971,117,744],(function(){return e(e.s=5334)})),_N_E=e.O()}]);