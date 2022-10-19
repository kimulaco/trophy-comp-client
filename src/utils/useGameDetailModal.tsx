import React, { FC, useState, useCallback, memo } from 'react'
import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { RiCheckboxCircleFill, RiLock2Line } from 'react-icons/ri'
import { Flex, Box } from '@/components/chakra/'
import { Game, Trophy } from '@/types/steam'

type UseGameDetailModal = () => {
  isOpen: boolean
  showModal: (game: Game) => void
  hideModal: () => void
  GameDetailModal: FC
}

export const useGameDetailModal: UseGameDetailModal = () => {
  const [game, setGame] = useState<Game|undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const showModal = useCallback((game: Game) => {
    setGame(game)
    onOpen()
  }, [setGame, onOpen])

  const hideModal = useCallback(() => {
    onClose()
    setGame(undefined)
  }, [setGame, onClose])

  const GameDetailModal: FC = memo(function GameDetailModal() {
    const handleOnClose = useCallback(() => {
      onClose()
    }, [onClose])

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        isCentered
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{game?.name || ''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {game &&
              <Box mb={4}>
                <img
                  src={game.headerImgUrl}
                  alt=""
                  width={460}
                  height={215}
                  loading="lazy"
                />
              </Box>
            }
            {game && (
              <Box as='ul' listStyleType='none'>
                {(game.trophies || []).map((trophy: Trophy) => {
                  return (
                    <Flex
                      key={`${game?.appId || ''}-${trophy.apiname}`}
                      as='li'
                      alignItems='center'
                      mb={2}
                    >
                      <Icon as={trophy.achieved ? RiCheckboxCircleFill : RiLock2Line} mr={2} />
                      <Box>{trophy.name}</Box>
                    </Flex>
                  )
                })}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  })

  return {
    isOpen,
    showModal,
    hideModal,
    GameDetailModal,
  }
}
