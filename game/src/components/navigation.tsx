import { Popover, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Div100vh from 'react-div-100vh';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BrandDiscord,
  BrandTwitter,
  Menu,
  X,
} from 'tabler-icons-react';
// @ts-ignore
import logo from '../favicon.png';

const links = [
  {
    label: 'Summoning',
    to: '/',
    disabled: false,
  },
];

const socials = [
  {
    icon: <BrandTwitter color={'white'} />,
    to: '',
  },
  {
    icon: <BrandDiscord color={'white'} />,
    to: '',
  },
];

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav
        className={
          'grid grid-cols-3 items-center font-bangers tracking-widest hidden lg:grid mx-auto pt-8 pb-4 px-6 bg-black'
        }
      >
        <div
          className={'w-[56px] cursor-pointer hover:brightness-110'}
        >
          <NavLink to="/">
            <img src={logo} alt="logo" />
          </NavLink>
        </div>
        <ul className={'flex justify-self-center gap-6'}>
          {links.map(({ label, to, disabled }) =>
            !disabled ? (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    'px-4 py-2 font-bold text-xl tracking-widest' +
                    (isActive
                      ? ' text-black bg-primary nav-clip-path shadow-lg scale-125'
                      : ' text-white')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ) : (
              <li
                key={to}
                className={
                  'font-bold text-xl text-gray-300 cursor-not-allowed'
                }
              >
                {label}
              </li>
            )
          )}
        </ul>
        <ul className={'flex gap-6 justify-self-end'}>
          {socials.map(({ icon, to }) => (
            <li key={to} className={'text-white text-lg font-bold'}>
              <a href={to} target={'_blank'}>
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Popover as={'nav'} className={'w-full pr-8 z-50'}>
        {({ close }) => (
          <>
            <div
              className={
                'flex bg-black items-center w-full justify-between lg:hidden py-4 pl-4'
              }
            >
              <div
                className={
                  'w-[56px] cursor-pointer hover:brightness-110'
                }
              >
                <NavLink to="/">
                  <img src={logo} alt="logo" />
                </NavLink>
              </div>
              {/* Mobile menu button */}
              <div className="right-0 flex-shrink-0">
                <Popover.Button>
                  <Menu color={'white'} size={32} />
                </Popover.Button>
              </div>
            </div>
            <Transition.Root as={Fragment}>
              <div className="lg:hidden h-full">
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Overlay className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    className="absolute z-50 top-0 inset-x-0 max-w-3xl mx-auto w-full transition transform origin-top h-full"
                  >
                    <Div100vh>
                      <div className="ring-1 ring-black ring-opacity-5 bg-[#020720] h-full overflow-y-auto divide-y divide-slate-700">
                        <div className="pt-3 pb-2">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              <img
                                className="h-8 w-auto"
                                src={logo}
                                alt="Logo"
                                onClick={() => {
                                  navigate('/');
                                  close();
                                }}
                              />
                            </div>
                            <div className="">
                              <Popover.Button className="bg-transparent rounded-md p-1 inline-flex items-center justify-center">
                                <span className="sr-only">
                                  Close menu
                                </span>
                                <X color={'white'} />
                              </Popover.Button>
                            </div>
                          </div>
                          <div className="mt-3 px-2 space-y-1">
                            {links.map(({ label, to, disabled }) =>
                              disabled ? (
                                <div
                                  key={label}
                                  className={
                                    'inline-flex items-center block text-xl font-bangers w-full bg-[#293757]/10 px-3 py-2 text-gray-400 rounded-md cursor-none'
                                  }
                                >
                                  {label}
                                </div>
                              ) : (
                                <NavLink
                                  key={label}
                                  to={to}
                                  onClick={() => close()}
                                  className={({ isActive }) =>
                                    classNames(
                                      isActive
                                        ? 'text-white text-gray-400 bg-[#293757]/40'
                                        : 'hover:text-gray-400 bg-[#293757] ',
                                      'block rounded-md px-3 py-2 font-bangers text-white text-xl tracking-widest'
                                    )
                                  }
                                >
                                  {label}
                                </NavLink>
                              )
                            )}
                            {socials.map(({ icon, to }) => (
                              <a
                                key={to}
                                href={to}
                                target={'_blank'}
                                className={
                                  'block rounded-md px-3 py-2'
                                }
                              >
                                {icon}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Div100vh>
                  </Popover.Panel>
                </Transition.Child>
              </div>
            </Transition.Root>
          </>
        )}
      </Popover>
    </>
  );
};

export default Navigation;
