import { Image } from 'react-native';
import React from 'react';

import MainContainer from '@/shared/ui/Container/MainContainer';

type PhotoLentProps = {
  photoUrl?: string;
};

const PhotoLent = ({ photoUrl }: PhotoLentProps) => {
  return (
    <MainContainer>
      <Image
        source={{
          uri:
            photoUrl ||
            'https://avatars.mds.yandex.net/get-mpic/11532558/2a0000018b43788a1a1069b6cb1d6a50f47a/orig',
        }}
        style={{ width: '100%', height: 272, borderRadius: 24 }}
      />
    </MainContainer>
  );
};

export default PhotoLent;
