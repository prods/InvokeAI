import { Box } from '@chakra-ui/react';
import {
  TypesafeDroppableData,
  isValidDrop,
  useDroppable,
} from 'app/components/ImageDnd/typesafeDnd';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, memo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IAIDropOverlay from './IAIDropOverlay';

type IAIDroppableProps = {
  dropLabel?: ReactNode;
  disabled?: boolean;
  data?: TypesafeDroppableData;
  hoverRef?: React.Ref<HTMLDivElement>;
};

const IAIDroppable = (props: IAIDroppableProps) => {
  const { dropLabel, data, disabled, hoverRef } = props;
  const dndId = useRef(uuidv4());

  const { isOver, setNodeRef, active } = useDroppable({
    id: dndId.current,
    disabled,
    data,
  });

  return (
    <Box
      ref={setNodeRef}
      position="absolute"
      top={0}
      insetInlineStart={0}
      w="full"
      h="full"
      pointerEvents="none"
    >
      <AnimatePresence>
        {isValidDrop(data, active) && (
          <IAIDropOverlay isOver={isOver} label={dropLabel} />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default memo(IAIDroppable);
