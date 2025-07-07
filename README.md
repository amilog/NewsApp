# News App RN app

> **Qısa izahat** – Task üçün funksional, lakin minimal dizaynlı "xəbər" app-i. React Native CLI ilə yaratdım çünki oba app cli da yazılıb. TypeScript + Zustand + Reanimated və s. istifadə edir. .env file ı nı əlavə etdim ancaq api key verməli olduğumuz zaman problem yaranmasın deyə birbaşa urldə qeyd etdim.

## Nə var?

- ⚡ **Sonsuz skrol** – FlatList + `onEndReached`, bütün state Zustand-dadır.
- 🚀 **Keş & offline** – `@react-native-async-storage/async-storage` (tapşırıq tələb etdiyi üçün; real proyektlərdə adətən MMKV seçirəm).
- 💾 **Favori siyahısı** – Zustand persist.
- 🎞️ **Reanimated** – Animasyalar üçün.
- 🎨 **Dinamik tema** – cihaz rejimi dəyişəndə UI dərhal yenilənir.
- 🔗 **Aliaslar** – `tsconfig.json`-da `@modules`, `@services`, `@constants` və s. yolu qısaldır.

## APK / Demo

### 🎥 Video Demo

[![Watch the demo](https://github.com/user-attachments/assets/46ff1cde-be15-4dff-97fa-85e0227dbea2)](https://github.com/user-attachments/assets/46ff1cde-be15-4dff-97fa-85e0227dbea2)

- **APK**: [_news app_](https://drive.google.com/file/d/1wIcoFBsZuSYOHFxWX7M7QseEi1w_BhZO/view?usp=sharing)


