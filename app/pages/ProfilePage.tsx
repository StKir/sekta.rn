import { Text } from 'react-native';
import React from 'react';

import ContainerRadial from '../shared/ui/ContainerRadial/ContainerRadial';
import { useTheme } from '../shared/theme';

import { createStyles } from './styles/ProfilePage.styles';

const ProfilePage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ContainerRadial>
      <Text style={styles.title}>Профиль</Text>
    </ContainerRadial>
  );
};

export default ProfilePage;
