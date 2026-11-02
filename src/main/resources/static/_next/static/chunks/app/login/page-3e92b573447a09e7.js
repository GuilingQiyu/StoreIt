(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[626],{9125:function(e,t,r){Promise.resolve().then(r.bind(r,3186))},3186:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return LoginPage}});var React=r(2265),useState=React.useState,useEffect=React.useEffect,useRouter=r(9376).useRouter,useAuthStore=r(3864).t,api=r(1837).h,_u=r(3448),THEME_OPTIONS=_u.THEME_OPTIONS,getSavedTheme=_u.getSavedTheme,applyThemeToDom=_u.applyThemeToDom,getSavedLocale=_u.getSavedLocale,applyLocaleToDom=_u.applyLocaleToDom,detectBrowserLocale=_u.detectBrowserLocale,isLocaleFollowingBrowser=_u.isLocaleFollowingBrowser,tr=_u.tr,localizeServerMessage=_u.localizeServerMessage,Button=r(2381).z,Input=r(279).I,_lucide=r(9205);
const HardDrive=(0,_lucide.Z)("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);
const Lock=(0,_lucide.Z)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);
const User=(0,_lucide.Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);
const AlertCircle=(0,_lucide.Z)("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);
const CheckCircle2=(0,_lucide.Z)("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);
const ArrowRight=(0,_lucide.Z)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);
const Ticket=(0,_lucide.Z)("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"134"}],["path",{d:"M13 5v2",key:"1"}],["path",{d:"M13 17v2",key:"2"}],["path",{d:"M13 11v2",key:"3"}]]);
const Palette=(0,_lucide.Z)("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"45f9"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"121g"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"123f"}]]);
const Globe=(0,_lucide.Z)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o17"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);
const UserIcon=User;
function LoginPage() {
  const router = useRouter();
  const {
    login,
    checkAuth
  } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState(() => typeof window !== "undefined" ? getSavedTheme() : "classic");
  const [locale, setLocaleState] = useState(() => typeof window !== "undefined" ? getSavedLocale() : "zh");
  const [localeAuto, setLocaleAuto] = useState(() => typeof window !== "undefined" ? isLocaleFollowingBrowser() : true);
  const isEn = locale === "en";
  const t = (zh, en) => isEn ? en : zh;
  useEffect(() => {
    const syncAll = () => {
      const savedTheme = getSavedTheme();
      setTheme(savedTheme);
      applyThemeToDom(savedTheme);
      const activeLocale = getSavedLocale();
      const following = isLocaleFollowingBrowser();
      setLocaleState(activeLocale);
      setLocaleAuto(following);
      applyLocaleToDom(activeLocale);
    };
    syncAll();
    const onLanguageOrFocusChange = () => {
      const activeLocale = getSavedLocale();
      const following = isLocaleFollowingBrowser();
      setLocaleState(activeLocale);
      setLocaleAuto(following);
      applyLocaleToDom(activeLocale);
    };
    window.addEventListener("languagechange", onLanguageOrFocusChange);
    window.addEventListener("focus", onLanguageOrFocusChange);
    document.addEventListener("visibilitychange", onLanguageOrFocusChange);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("invite") || params.get("code");
      if (codeParam) {
        setInviteCode(codeParam.trim());
        setMode("register");
      } else if (window.location.hash === "#register") {
        setMode("register");
      }
    }
    checkAuth().then(loggedIn => {
      if (loggedIn) {
        router.push("/");
      }
    });
    return () => {
      window.removeEventListener("languagechange", onLanguageOrFocusChange);
      window.removeEventListener("focus", onLanguageOrFocusChange);
      document.removeEventListener("visibilitychange", onLanguageOrFocusChange);
    };
  }, [checkAuth, router]);
  const cycleTheme = () => {
    const idx = THEME_OPTIONS.findIndex(item => item.key === theme);
    const next = THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length].key;
    setTheme(next);
    applyThemeToDom(next);
  };
  const toggleLocale = () => {
    if (localeAuto) {
      const next = locale === "zh" ? "en" : "zh";
      setLocaleState(next);
      setLocaleAuto(false);
      applyLocaleToDom(next, true);
    } else if (locale === "en") {
      setLocaleState("zh");
      setLocaleAuto(false);
      applyLocaleToDom("zh", true);
    } else {
      const autoLoc = detectBrowserLocale();
      setLocaleState(autoLoc);
      setLocaleAuto(true);
      applyLocaleToDom(autoLoc, "auto");
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const fd = new FormData();
        fd.append("username", username.trim());
        fd.append("password", password);
        await login(fd);
        router.push("/");
      } else {
        if (password.length < 8) {
          throw new Error(t("口令至少需要 8 位字符", "Password must be at least 8 characters"));
        }
        if (password !== confirmPassword) {
          throw new Error(t("两次输入的口令不一致", "Passwords do not match"));
        }
        if (!inviteCode.trim()) {
          throw new Error(t("请输入管理员发放的邀请码", "Please enter an invitation code"));
        }
        await api.register(username.trim(), password, inviteCode.trim());
        setSuccessMsg(t("注册成功！正在进入储之工作台...", "Registration successful! Entering StoreIt workspace..."));
        await checkAuth();
        router.push("/");
      }
    } catch (err) {
      const rawMessage = err?.message ? localizeServerMessage(err.message, locale) : "";
      setErrorMsg(rawMessage || (mode === "login" ? t("登录失败，请检查账号与口令", "Login failed, please check your credentials") : t("注册失败，请检查邀请码", "Registration failed, please verify your invitation code")));
    } finally {
      setIsSubmitting(false);
    }
  };
  const currentThemeMeta = THEME_OPTIONS.find(item => item.key === theme) || THEME_OPTIONS[0];
  const localeBadgeText = localeAuto ? isEn ? "Auto · EN" : "自动 · 中文" : isEn ? "English" : "简体中文";
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center p-4 bg-brand-bg relative overflow-hidden transition-colors duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fixed top-4 right-4 z-30 flex items-center gap-2",
    style: {
      position: "fixed",
      top: "1rem",
      right: "1rem",
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggleLocale,
    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm text-xs font-medium text-foreground hover:bg-white transition-all",
    title: t("点击切换语言（自动跟随浏览器 / 简体中文 / English）", "Click to switch language (Auto / English / 简体中文)")
  }, /*#__PURE__*/React.createElement(Globe, {
    className: "w-3.5 h-3.5 text-brand-primary"
  }), /*#__PURE__*/React.createElement("span", null, localeBadgeText)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: cycleTheme,
    className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm text-xs font-medium text-foreground hover:bg-white transition-all",
    title: t("点击切换界面主题色", "Click to switch theme")
  }, /*#__PURE__*/React.createElement(Palette, {
    className: "w-3.5 h-3.5 text-brand-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full",
    style: {
      width: "0.625rem",
      height: "0.625rem",
      backgroundColor: currentThemeMeta.swatch
    }
  }), /*#__PURE__*/React.createElement("span", null, isEn ? currentThemeMeta.labelEn : currentThemeMeta.label))), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 relative z-10 space-y-6 storeit-modal-spring"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-primary/20"
  }, /*#__PURE__*/React.createElement(HardDrive, {
    className: "w-8 h-8"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold tracking-tight text-brand-primary pt-2"
  }, t("储之 StoreIt", "StoreIt")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, t("轻量级文件存储与跨服联邦共享服务", "Lightweight File Storage & Cross-Server Federated Sharing"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 p-1 rounded-2xl bg-muted/60 border text-xs font-semibold select-none"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode("login");
      setErrorMsg("");
    },
    className: `py-2 rounded-xl transition-all ${mode === "login" ? "bg-white text-brand-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
  }, t("账号登录", "Sign In")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode("register");
      setErrorMsg("");
    },
    className: `py-2 rounded-xl transition-all ${mode === "register" ? "bg-white text-brand-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
  }, t("受邀注册", "Invited Sign Up"))), errorMsg && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-4 h-4 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, errorMsg)), successMsg && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(CheckCircle2, {
    className: "w-4 h-4 text-emerald-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, successMsg)), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, mode === "register" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-foreground/80 block"
  }, t("注册邀请码", "Invitation Code")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Ticket, {
    className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    required: true,
    placeholder: t("请输入邀请码 (如 ST-XXXX-XXXX)", "Enter invite code (e.g. ST-XXXX-XXXX)"),
    value: inviteCode,
    onChange: e => setInviteCode(e.target.value),
    className: "pl-9 h-10 rounded-xl text-sm font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-foreground/80 block"
  }, t("用户名", "Username")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(UserIcon, {
    className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    required: true,
    autoFocus: true,
    placeholder: mode === "register" ? t("3~32位字母/数字/下划线", "3–32 letters, digits, or underscores") : t("请输入用户名", "Enter your username"),
    value: username,
    onChange: e => setUsername(e.target.value),
    className: "pl-9 h-10 rounded-xl text-sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-foreground/80 block"
  }, mode === "register" ? t("设置登录口令 (≥8位)", "Set Password (≥ 8 chars)") : t("登录口令", "Password")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Lock, {
    className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    required: true,
    placeholder: mode === "register" ? t("至少 8 位字符", "At least 8 characters") : t("请输入口令", "Enter your password"),
    value: password,
    onChange: e => setPassword(e.target.value),
    className: "pl-9 h-10 rounded-xl text-sm"
  }))), mode === "register" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-semibold text-foreground/80 block"
  }, t("确认登录口令", "Confirm Password")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Lock, {
    className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    required: true,
    placeholder: t("再次输入登录口令", "Re-enter your password"),
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    className: "pl-9 h-10 rounded-xl text-sm"
  }))), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: isSubmitting,
    className: "w-full h-10 rounded-xl gap-2 font-semibold shadow-md mt-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-95"
  }, isSubmitting ? t("正在处理...", "Processing...") : mode === "login" ? t("登录系统", "Sign In") : t("验证邀请码并注册", "Verify Invite & Sign Up"), /*#__PURE__*/React.createElement(ArrowRight, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-center pt-2 space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground"
  }, t("© 2025–2026 归灵祈昱 · 基于 ", "© 2025–2026 GuilingQiyu · Licensed under "), /*#__PURE__*/React.createElement("a", {
    href: "https://www.gnu.org/licenses/agpl-3.0.html",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-brand-primary hover:underline font-medium"
  }, "GNU AGPL-3.0"), t(" 开源协议发布", "")), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-muted-foreground"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/GuilingQiyu/StoreIt",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-brand-primary hover:underline inline-flex items-center gap-1 font-medium"
  }, t("查看源码 (GitHub: GuilingQiyu/StoreIt)", "Source Code (GitHub: GuilingQiyu/StoreIt)"))))));
}
}},function(e){e.O(0,[261,819,971,117,744],(function(){return e(e.s=9125)})),_N_E=e.O()}]);