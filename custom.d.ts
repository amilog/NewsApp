declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.webp' {
  const value: any;
  export default value;
}

declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    [key: string]: any;
  }
  const NetInfo: {
    addEventListener: (listener: (state: NetInfoState) => void) => () => void;
    fetch: () => Promise<NetInfoState>;
  };
  export default NetInfo;
}

declare module 'react-native-fast-image' {
  import { ImageStyle, ImageProps } from 'react-native';

  export interface FastImageSource {
    uri: string;
    headers?: { [key: string]: string };
    priority?: 'low' | 'normal' | 'high';
    cache?: 'immutable' | 'web' | 'cacheOnly';
  }

  export interface FastImageProps extends Omit<ImageProps, 'source'> {
    source: FastImageSource | number;
    style?: ImageStyle;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    onLoadStart?: () => void;
    onProgress?: (event: {
      nativeEvent: { loaded: number; total: number };
    }) => void;
    onLoad?: (event: {
      nativeEvent: { width: number; height: number };
    }) => void;
    onError?: () => void;
    onLoadEnd?: () => void;
  }

  const FastImage: React.ComponentType<FastImageProps> & {
    resizeMode: {
      contain: 'contain';
      cover: 'cover';
      stretch: 'stretch';
      center: 'center';
    };
    priority: {
      low: 'low';
      normal: 'normal';
      high: 'high';
    };
    cacheControl: {
      immutable: 'immutable';
      web: 'web';
      cacheOnly: 'cacheOnly';
    };
    preload: (sources: FastImageSource[]) => void;
    clearMemoryCache: () => Promise<void>;
    clearDiskCache: () => Promise<void>;
  };

  export default FastImage;
}
