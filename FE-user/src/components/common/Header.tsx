import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import {
  LogOut,
  Ticket,
  ChevronDown,
  User,
  MessageSquare,
  Crown
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openUtilityMenu, setOpenUtilityMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const utilityMenuRef = useRef<HTMLDivElement>(null);

  // Click ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false);
      }

      if (
        utilityMenuRef.current &&
        !utilityMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUtilityMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-black italic tracking-tighter text-primary transition-all hover:scale-105"
        >
          CGV CINEMAS
        </Link>

        {/* MENU */}
        <nav className="hidden items-center gap-8 text-sm font-black uppercase tracking-widest text-zinc-400 md:flex">

          <Link
            to="/"
            className="transition-colors hover:text-primary"
          >
            Rạp
          </Link>

          <Link
            to="/cinemas"
            className="transition-colors hover:text-primary"
          >
            Lịch chiếu
          </Link>

          <Link
            to="/promotions"
            className="transition-colors hover:text-primary"
          >
            Ưu đãi
          </Link>

          {/* TIỆN ÍCH DROPDOWN */}
          <div
            ref={utilityMenuRef}
            className="relative"
          >
            <button
              onClick={() => setOpenUtilityMenu(!openUtilityMenu)}
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              TIỆN ÍCH
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openUtilityMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-10 right-0 w-52 rounded-2xl border border-zinc-800 bg-card p-2 shadow-2xl transition-all duration-200 ${
                openUtilityMenu
                  ? "visible opacity-100 translate-y-0"
                  : "invisible opacity-0 -translate-y-2"
              }`}
            >
              <Link
                to="/member"
                onClick={() => setOpenUtilityMenu(false)}
                className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-primary"
              >
                <Crown size={18} />
                Thành viên
              </Link>

              <Link
                to="/feedback"
                onClick={() => setOpenUtilityMenu(false)}
                className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-primary"
              >
                <MessageSquare size={18} />
                Phản hồi
              </Link>
            </div>
          </div>
        </nav>

        {/* USER */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div
              ref={userMenuRef}
              className="relative"
            >
              {/* BUTTON USER */}
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-3 rounded-full transition-all hover:scale-[1.02]"
              >
                <span className="hidden text-base font-bold text-white md:block">
                  {user?.full_name}
                </span>

                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-primary p-0.5 shadow-lg shadow-primary/20">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=e71a0f&color=fff&bold=true`}
                    className="h-full w-full rounded-full object-cover"
                    alt="avatar"
                  />
                </div>

                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    openUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`absolute right-0 top-14 w-56 rounded-2xl border border-zinc-800 bg-card p-2 shadow-2xl transition-all duration-200 ${
                  openUserMenu
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 -translate-y-2"
                }`}
              >
                {/* Vé của tôi */}
                <Link
                  to="/profile"
                  onClick={() => setOpenUserMenu(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-primary"
                >
                  <Ticket size={18} />
                  Vé của tôi
                </Link>

                {/* Thông tin cá nhân */}
                <Link
                  to="/profile-info"
                  onClick={() => setOpenUserMenu(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold transition-all hover:bg-zinc-800 hover:text-primary"
                >
                  <User size={18} />
                  Giới thiệu
                </Link>

                {/* Logout */}
                <button
                  onClick={() => {
                    setOpenUserMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-bold text-primary transition-all hover:bg-zinc-800"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-6 py-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}