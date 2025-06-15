import "@childrenofukiyo/core/dist/style.css";
import "./App.css";
import { Logo } from "@childrenofukiyo/core";
import { NavLink, useNavigate } from "react-router-dom";
import React, { Fragment } from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { Popover, Transition } from "@headlessui/react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import Div100vh from "react-div-100vh";

const navigation = [
  { name: "Roadmap", to: "/roadmap", disabled: false },
  { name: "The Sanctuary", to: "/sanctuary", disabled: false },
  { name: "Team", to: "/team", disabled: false },
  { name: "Ramen Shop", to: "/shop", disabled: true }
];

const socials = [
  { Icon: FaTwitter, to: "https://twitter.com/childrenofukiyo" },
  { Icon: FaDiscord, to: "https://discord.gg/nyusbxqd" }
];

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

function Navigation() {
  const navigate = useNavigate();

  return (
    <Div100vh className={"overflow-hidden bg-[#EFEADB]/50"}>
      <Popover as={"header"} className={"fixed w-full px-6 py-4 z-10"}>
        {({ close }) => (
          <>
            <nav className={"flex items-center w-full justify-between"}>
              <img className={"w-12 hover:brightness-110"} src={Logo} alt={"logo"} onClick={() => navigate("/")} />
              <div className={"hidden md:flex gap-4 items-center wrap"}>
                {navigation.map((item) => (
                  item.disabled ?
                    <div key={item.name}
                         className={"inline-flex items-center px-2 h-6 text-[10px] text-gray-300 rounded-md cursor-none"}>
                      {item.name}
                    </div>
                    :
                    <NavLink key={item.name}
                             to={item.to}
                             className={({ isActive }) => classNames(
                               isActive ? "text-gray-500 bg-[#72F5F1]/40"
                                 : "hover:text-gray-500 bg-[#72F5F1]/80 ",
                               "inline-flex items-center px-2 h-6 text-[10px] hover:bg-[#72F5F1]/40 rounded-md"
                             )}>
                      {item.name}
                    </NavLink>
                ))}
                {socials.map((item) => (
                  <a key={item.to}
                     href={item.to}
                     target={"_blank"}
                     className={"border-transparent rounded-md flex justify-center items-center px-2 h-6 hover:text-gray-500 bg-[#72F5F1]/80 hover:bg-[#72F5F1]/40"}>
                    <item.Icon className={"w-4 h-4"} />
                  </a>
                ))}
              </div>
              {/* Mobile menu button */}
              <div className="right-0 flex-shrink-0 md:hidden">
                <Popover.Button>
                  <HiMenuAlt4 className="block  h-8 w-8" aria-hidden="true" />
                </Popover.Button>
              </div>
            </nav>
            <Transition.Root as={Fragment}>
              <div className="md:hidden h-full">
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <Popover.Overlay className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95">
                  <Popover.Panel
                    focus
                    className="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top h-screen">
                    <div
                      className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-[#EFEADB] h-full overflow-y-auto divide-y divide-slate-700">
                      <div className="pt-3 pb-2">
                        <div className="flex items-center justify-between px-4">
                          <div>
                            <img
                              className="h-8 w-auto"
                              src={Logo}
                              alt="Logo"
                              onClick={() => {
                                navigate("/");
                                close();
                              }}
                            />
                          </div>
                          <div className="-mr-2">
                            <Popover.Button
                              className="bg-transparent rounded-md p-1 inline-flex items-center justify-center">
                              <span className="sr-only">Close menu</span>
                              <HiX className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                          </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                          {navigation.map((item) => (
                            item.disabled ?
                              <div key={item.name}
                                   className={"inline-flex items-center block px-3 py-2 text-gray-300 rounded-md cursor-none"}>
                                {item.name}
                              </div>
                              :
                              <NavLink key={item.name}
                                       to={item.to}
                                       onClick={() => close()}
                                       className={({ isActive }) => classNames(
                                         isActive ? "text-gray-500 bg-[#72F5F1]/40"
                                           : "hover:text-gray-500 bg-[#72F5F1]/80 ",
                                         "block rounded-md px-3 py-2"
                                       )}>
                                {item.name}
                              </NavLink>
                          ))}
                          {socials.map((item) => (
                            <a key={item.to}
                               href={item.to}
                               target={"_blank"}
                               className={"block rounded-md px-3 py-2"}>
                              <item.Icon className={"w-4 h-4"} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition.Child>
              </div>
            </Transition.Root>
          </>
        )}
      </Popover>
    </Div100vh>
  );
}

export default Navigation;
