import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

export interface NotificationProps {
  id: string;
  destroy: () => void;
  title: string;
  message?: string;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = (props) => {
  const { destroy, message, title, duration = 5000, id } = props;
  const [ show, setShow ] = useState(false);

  useEffect(() => {
    if (!duration) return;
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [ destroy, duration ]);

  return (
    <>
      <div
        aria-live="assertive"
        className="relative inset-0 my-3 flex items-end pointer-events-none sm:items-start">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={destroy}>
            <div
              className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    {message &&
                      <p className="mt-1 text-sm text-gray-500">{message}</p>
                    }
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShow(false)}>
                      <span className="sr-only">Close</span>
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};

interface NotificationOptions {
  id?: string;
  title: string;
  message?: string;
  duration?: number;
}

export class NotificationManager {
  private containerRef: HTMLDivElement;
  private toasts: NotificationProps[] = [];

  constructor() {
    const body = document.getElementsByTagName("body")[0] as HTMLBodyElement;
    const toastContainer = document.createElement("div") as HTMLDivElement;
    toastContainer.id = "toast-container-main";
    toastContainer.className = "fixed min-w-[512px] max-w-full bottom-0 right-0 pb-3 pr-6";
    body.insertAdjacentElement("afterend", toastContainer);
    this.containerRef = toastContainer;
  }

  public show(options: NotificationOptions): void {
    const toastId = Math.random().toString(36).substring(2, 9);
    const toast: NotificationProps = {
      id: toastId,
      ...options, // if id is passed within options, it will overwrite the auto-generated one
      destroy: () => this.destroy(options.id ?? toastId)
    };

    this.toasts = [ toast, ...this.toasts ];
    this.render();
  }

  public destroy(id: string): void {
    this.toasts = this.toasts.filter((toast: NotificationProps) => toast.id !== id);
    this.render();
  }

  private render(): void {
    const toastsList = this.toasts.map((toastProps: NotificationProps) => (
      <Notification key={toastProps.id} {...toastProps} />
    ));
    ReactDOM.render(toastsList, this.containerRef);
  }
}

export const notification = new NotificationManager();