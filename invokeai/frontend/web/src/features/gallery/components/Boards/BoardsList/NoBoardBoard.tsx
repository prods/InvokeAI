import { Box, ChakraProps, Flex, Image, Text } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { MoveBoardDropData } from 'app/components/ImageDnd/typesafeDnd';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import InvokeAILogoImage from 'assets/images/logo.png';
import IAIDroppable from 'common/components/IAIDroppable';
import SelectionOverlay from 'common/components/SelectionOverlay';
import { boardIdSelected } from 'features/gallery/store/gallerySlice';
import { memo, useCallback, useMemo, useState } from 'react';
import { useBoardName } from 'services/api/hooks/useBoardName';
import { useBoardTotal } from 'services/api/hooks/useBoardTotal';
import AutoAddIcon from '../AutoAddIcon';
import BoardContextMenu from '../BoardContextMenu';

const BASE_BADGE_STYLES: ChakraProps['sx'] = {
  bg: 'base.500',
  color: 'whiteAlpha.900',
};
interface Props {
  isSelected: boolean;
}

const selector = createSelector(
  stateSelector,
  ({ gallery }) => {
    const { autoAddBoardId } = gallery;
    return { autoAddBoardId };
  },
  defaultSelectorOptions
);

const NoBoardBoard = memo(({ isSelected }: Props) => {
  const dispatch = useAppDispatch();
  const { totalImages, totalAssets } = useBoardTotal(undefined);
  const { autoAddBoardId } = useAppSelector(selector);
  const boardName = useBoardName(undefined);
  const handleSelectBoard = useCallback(() => {
    dispatch(boardIdSelected(undefined));
  }, [dispatch]);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseOver = useCallback(() => {
    setIsHovered(true);
  }, []);
  const handleMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const droppableData: MoveBoardDropData = useMemo(
    () => ({
      id: 'no_board',
      actionType: 'MOVE_BOARD',
      context: { boardId: undefined },
    }),
    []
  );

  return (
    <Box sx={{ w: 'full', h: 'full', touchAction: 'none', userSelect: 'none' }}>
      <Flex
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        sx={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: '1/1',
          borderRadius: 'base',
          w: 'full',
          h: 'full',
        }}
      >
        <BoardContextMenu>
          {(ref) => (
            <Flex
              ref={ref}
              onClick={handleSelectBoard}
              sx={{
                w: 'full',
                h: 'full',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 'base',
                cursor: 'pointer',
                bg: 'base.200',
                _dark: {
                  bg: 'base.800',
                },
              }}
            >
              <Flex
                sx={{
                  w: 'full',
                  h: 'full',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* <Icon
                  boxSize={12}
                  as={FaBucket}
                  sx={{
                    opacity: 0.7,
                    color: 'base.500',
                    _dark: {
                      color: 'base.500',
                    },
                  }}
                /> */}
                <Image
                  src={InvokeAILogoImage}
                  alt="invoke-ai-logo"
                  sx={{
                    opacity: 0.4,
                    filter: 'grayscale(1)',
                    mt: -6,
                    w: 16,
                    h: 16,
                    minW: 16,
                    minH: 16,
                    userSelect: 'none',
                  }}
                />
              </Flex>
              {/* <Flex
                sx={{
                  position: 'absolute',
                  insetInlineEnd: 0,
                  top: 0,
                  p: 1,
                }}
              >
                <Badge variant="solid" sx={BASE_BADGE_STYLES}>
                  {totalImages}/{totalAssets}
                </Badge>
              </Flex> */}
              {!autoAddBoardId && <AutoAddIcon />}
              <Flex
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  p: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  w: 'full',
                  maxW: 'full',
                  borderBottomRadius: 'base',
                  bg: isSelected ? 'accent.400' : 'base.500',
                  color: isSelected ? 'base.50' : 'base.100',
                  _dark: {
                    bg: isSelected ? 'accent.500' : 'base.600',
                    color: isSelected ? 'base.50' : 'base.100',
                  },
                  lineHeight: 'short',
                  fontSize: 'xs',
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {boardName}
              </Flex>
              <SelectionOverlay isSelected={isSelected} isHovered={isHovered} />
              <IAIDroppable
                data={droppableData}
                dropLabel={<Text fontSize="md">Move</Text>}
              />
            </Flex>
          )}
        </BoardContextMenu>
      </Flex>
    </Box>
  );
});

NoBoardBoard.displayName = 'HoverableBoard';

export default NoBoardBoard;
