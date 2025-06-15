import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
// @ts-ignore
import openScroll from "../assets/images/open_scroll.png";
import "./modal.css";
import gsap from "gsap";

interface ModalProps {
  visible: boolean,
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    gsap.from(contentRef.current, 5, { height: 0 });
  });

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="relative inline-block text-left flex items-center justify-center transform transition-all">
              <img src={openScroll} alt={""} className={"w-[690px] h-[1000px]"} />
              <div
                className={"absolute top-0 left-0 h-full flex flex-col items-center"}>
                <div ref={contentRef}
                     className={"h-[650px] mask mt-40 pb-20 overflow-y-auto md:w-[690px] px-20 md:w-full"}>
                  <h3 className={"mt-20"}>Children of Ukiyo</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula, felis sit amet
                    efficitur
                    fermentum, ligula nunc sodales ex, ac viverra ligula massa eu libero. Suspendisse potenti. Fusce
                    consequat libero lacus, et molestie nibh volutpat at. Duis et augue quis lacus ornare laoreet nec
                    sed
                    nulla. Morbi porttitor nunc est, at facilisis justo hendrerit quis. Mauris neque massa, pharetra
                    quis
                    nisi id, interdum ultrices tortor. Nunc quis lobortis ipsum. Vestibulum ante ipsum primis in
                    faucibus
                    orci luctus et ultrices posuere cubilia curae; Praesent eleifend mauris id turpis faucibus, eget
                    tincidunt mauris scelerisque. Praesent non interdum ipsum. Morbi lobortis arcu eu est lacinia, eu
                    tempor orci convallis. Nullam est augue, auctor maximus nunc id, pretium gravida risus.

                    Sed tincidunt augue sit amet diam tempor porttitor. In id rutrum urna. Cras sagittis pellentesque
                    erat. Suspendisse vehicula urna eros, sed pellentesque nisl pharetra a. Orci varius natoque
                    penatibus
                    et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum non ex et turpis sollicitudin
                    tristique. Aenean tempus diam molestie, rhoncus augue vitae, laoreet justo. Ut diam urna, vehicula
                    consequat orci ut, mattis semper eros. Integer elit nisi, consequat eget sodales a, volutpat in
                    felis.
                    Donec leo massa, efficitur in venenatis quis, euismod non nulla. Cras in porttitor leo.

                    Quisque finibus ut diam egestas sodales. Maecenas venenatis nec diam a facilisis. Suspendisse augue
                    ex, pretium nec tortor vel, placerat varius neque. In hac habitasse platea dictumst. Donec eget
                    elementum velit. Proin molestie magna id rutrum convallis. Aenean dignissim libero augue,
                    scelerisque
                    porttitor tellus tincidunt ut. Etiam a ultrices tellus.

                    Phasellus eu enim non ligula vehicula mollis non at neque. Integer sapien ante, pulvinar at justo
                    gravida, pharetra mollis nunc. Curabitur magna arcu, lobortis a purus sit amet, luctus sodales diam.
                    Vivamus id leo non risus iaculis consectetur in eu sem. Sed congue dui lectus, sed commodo urna
                    dictum
                    a. Pellentesque commodo pretium interdum. Ut et mi ante. Curabitur pharetra augue vel sapien
                    accumsan
                    placerat. Donec purus ligula, luctus id risus in, vehicula suscipit tellus. Vestibulum ante ipsum
                    primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce nec feugiat augue.

                    Etiam nulla felis, accumsan sed odio id, cursus imperdiet diam. Mauris eget urna cursus enim posuere
                    bibendum. Aliquam porttitor libero id laoreet volutpat. Maecenas ipsum risus, consectetur imperdiet
                    erat aliquam, viverra dapibus felis. Mauris rutrum massa sed tristique dignissim. Fusce eget urna
                    ante. Duis volutpat lectus lorem, id laoreet risus feugiat at. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae; Mauris sit amet sollicitudin elit.
                  </p>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;