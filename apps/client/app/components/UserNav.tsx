import React, { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'

type Props = {
  navItems: any[]
  button: React.FC
  positionClasses: string
}

const UserNav: React.FC<Props> = React.memo(function UserNav({ navItems, button, positionClasses }) {
  const Button = button

  return (
    <Menu as="div" className="relative mx-3">
      <div>
        <Button />
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${positionClasses} absolute mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {navItems.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  href={item.href}
                  className={classNames('block py-2 px-4 text-sm text-gray-700', {
                    'bg-gray-100': active,
                  })}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
})

export default UserNav
