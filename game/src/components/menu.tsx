import {
  ActionIcon,
  Card,
  Image,
  Modal,
  Tabs,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import React from 'react';
import { X } from 'tabler-icons-react';
// @ts-ignore
import swordImage from '../../resources/images/Children_of_Ukiyo_Nfts_1.png';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onClose }) => {
  return (
    <>
      <Modal
        classNames={{ modal: 'bg-[#EFEADB] h-full' }}
        opened={visible}
        onClose={onClose}
        size="full"
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        closeOnEscape
        withCloseButton={false}
      >
        <Tabs grow className={'p-2'} variant="pills">
          <Tabs.Tab label="Roadmap">
            <div
              className={
                'absolute bottom-0 right-0 w-[450px] opacity-25 md:opacity-100'
              }
            >
              <Image src={swordImage} alt="Random unsplash image" />
            </div>
            <Title order={3} className={'py-4 px-2'}>
              The Road to Ukiyo
            </Title>
            <Timeline active={1} className={'px-4 md:w-1/2'}>
              <Timeline.Item
                title="Code review"
                className={'relative'}
              >
                <Text size="xs" mt={4}>
                  March 2022
                </Text>
                <Text mt={4}>
                  Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nesciunt nulla quam aut sed corporis
                  voluptates praesentium inventore, sapiente ex
                  tempore sit consequatur debitis non! Illo cum ipsa
                  reiciendis quidem facere, deserunt eos totam
                  impedit. Vel ab, ipsum veniam aperiam odit molestiae
                  incidunt minus, sint eos iusto earum quaerat vitae
                  perspiciatis.
                </Text>
              </Timeline.Item>
              <Timeline.Item
                title="Code review"
                className={'relative'}
              >
                <Text size="xs" mt={4}>
                  March 2022
                </Text>
                <Text mt={4}>
                  Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nesciunt nulla quam aut sed corporis
                  voluptates praesentium inventore, sapiente ex
                  tempore sit consequatur debitis non! Illo cum ipsa
                  reiciendis quidem facere, deserunt eos totam
                  impedit. Vel ab, ipsum veniam aperiam odit molestiae
                  incidunt minus, sint eos iusto earum quaerat vitae
                  perspiciatis.
                </Text>
              </Timeline.Item>
              <Timeline.Item
                title="Code review"
                className={'relative'}
              >
                <Text size="xs" mt={4}>
                  March 2022
                </Text>
                <Text mt={4}>
                  Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nesciunt nulla quam aut sed corporis
                  voluptates praesentium inventore, sapiente ex
                  tempore sit consequatur debitis non! Illo cum ipsa
                  reiciendis quidem facere, deserunt eos totam
                  impedit. Vel ab, ipsum veniam aperiam odit molestiae
                  incidunt minus, sint eos iusto earum quaerat vitae
                  perspiciatis.
                </Text>
              </Timeline.Item>
              <Timeline.Item
                title="Code review"
                className={'relative'}
              >
                <Text size="xs" mt={4}>
                  March 2022
                </Text>
                <Text mt={4}>
                  Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nesciunt nulla quam aut sed corporis
                  voluptates praesentium inventore, sapiente ex
                  tempore sit consequatur debitis non! Illo cum ipsa
                  reiciendis quidem facere, deserunt eos totam
                  impedit. Vel ab, ipsum veniam aperiam odit molestiae
                  incidunt minus, sint eos iusto earum quaerat vitae
                  perspiciatis.
                </Text>
              </Timeline.Item>
            </Timeline>
          </Tabs.Tab>
          <Tabs.Tab label="Team">
            <div className={'py-4 px-2'}>
              <Card shadow="sm" p="xl" component="a">
                <Card.Section>
                  <Image
                    src="unsplash.png"
                    height={160}
                    alt="No way!"
                  />
                </Card.Section>

                <Text weight={500} size="lg">
                  You've won a million dollars in cash!
                </Text>

                <Text size="sm">
                  Please click anywhere on this card to claim your
                  reward, this is not a fraud, trust us
                </Text>
              </Card>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Whitepaper">Third tab content</Tabs.Tab>
        </Tabs>
        <div
          className={'absolute right-0 top-0 p-1 -translate-y-[30px]'}
        >
          <ActionIcon onClick={onClose} size={24} variant="light">
            <X strokeWidth={2} />
          </ActionIcon>
        </div>
      </Modal>
    </>
  );
};

export default Menu;
