import React, { useMemo } from 'react';
import { Text } from 'react-native';
import globalStyles from '../styles/globalStyles';

const ThemedText = ({ children, center, type = 'normal', marginBottom, style, complete = true, max = 22 }) => {

  const textColor = "#000";
  const MAX_LENGTH = max;

  // Calcula el texto a mostrar, truncando si es necesario
  const displayText = useMemo(() => {
    if (typeof children === 'string' && children.length > MAX_LENGTH && !complete) {
      return children.slice(0, MAX_LENGTH) + '…';
    }
    return children;
  }, [children]);

  return (
    <Text
      style={[
        { textAlign: center ? 'center' : 'left', marginBottom, color: textColor },
        type === 'title' && globalStyles.title,
        type === 'subtitle' && globalStyles.subtitle,

        type === 'normal' && globalStyles.normalText,
        type === 'normalSmall' && globalStyles.normalTextSmall,

        type === 'normalBold' && globalStyles.normalTextBold,
        type === 'normalBoldSmall' && globalStyles.normalBoldSmall,

        type === 'link' && globalStyles.linkText,
        type === 'link-small' && globalStyles.linkTextSmall,

        type === 'button' && globalStyles.buttonTextStyle,
        type === 'titleNoticia' && globalStyles.titleNoticia,
        type === 'noticia' && globalStyles.noticia,
        style,
      ]}
    >
      {displayText}
    </Text>
  );
};

export default ThemedText;
