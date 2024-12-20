# WebGame with **Websocket**

- Websocket을 이용해 서버와 통신을 하며 검증 과정을 거치는 WebGame 프로젝트 입니다.

- 일부 기간 (2024.12.20~ 2024.12.23) 동안 체험이 가능 합니다! http://52.4.56.68:3000/

## Client

- 기존에 좋아하는 장르인 Vampire Survival Like 를 간략화하여 HTML의 canvas 기능을 사용해 구현하였습니다.

### 기능

- 닉네임을 입력하여 게임에 진입할 수 있습니다.

![image](https://github.com/user-attachments/assets/5bd14252-0395-4114-982c-2b2112edee33)

![image](https://github.com/user-attachments/assets/269354a2-59ca-472e-a532-c7ff7b737cbc)

- 진입한 게임은 Vampire Survival Like 유형으로 시간이 지남에 따라 Stage가 증가합니다.
( 스테이지가 증가할 수록 얻는 점수가 증가합니다! )

- Stage가 증가할 수록 강력한 적과 아이템이 드랍됩니다.  
(스테이지 구분을 위해 아래의 체크무늬 색이 변하게 됩니다!)

- 체력은 기본값 3으로 피격 당할 시마다 -1씩 감소하게 됩니다.

> 하지만 걱정마세요!
일부 아이템은 체력을 회복시켜줄 수 있습니다!

- 총 10분을 넘기게 되면 게임을 클리어 할 수 있습니다.

## Server

- Node.js의 express 와 Websocket Package들을 이용하여 서버와 클라이언트의 통신을 설계하였습니다.

- 아래는 프로젝트 시작 전, 초기 디자인입니다. 

![image](https://github.com/user-attachments/assets/2bb890cc-2118-4ca2-9342-fb40c6e7c26c)

### 기능

#### 유저 확인

- 클라이언트에서 게임 접속 시, 자신의 User_ID를 찾아(LocalStorage 이용) 서버에 전송하게 됩니다.

- 이 때 서버는 User_ID가 알맞은 유형인지, 서버의 User(model)에 존재하는지를 확인합니다.

- 만약 서버에 존재하는 유저라면 유저의 일부 값(소켓ID, 닉네임) 을 수정한 뒤 클라이언트에게 전달합니다.

- 아니라면 새롭게 ID를 생성하여 클라이언트에게 전달합니다.

-> 클라이언트는 이 값을 통해 화면구성 요소를 생성합니다.

![image](https://github.com/user-attachments/assets/45151ab1-78b5-4566-8888-54c423dd65ea)

#### 스테이지 이동

- 클라이언트와 서버는 현재 동일한 데이터 테이블 (Stage, Unlock, Monster, Item)를 공유하고 있습니다.

- DATA - 기본 형식

| Field | Type | Description|
|---|---|---|
| name | STRING | 테이블의 이름 |
| version | STRING | 테이블의 버전 |
| data | JSON | 테이블에 저장되어 사용되는 정보 |

- DATA - Stage

| Field | Type | Description|
|---|---|---|
| level | INT | 스테이지의 레벨 |
| time | INT | 스테이지 진입에 필요한 시간(단위: 초) |
| scorePerSecond | INT | 스테이지의 초당 획득하는 점수 ID |
| color | STRING | 스테이지의 체크무늬 색 (헥사 색상 코드)|
| spawn | INT | 10초당 생성될 몬스터의 수 |

- 유저가 일정 시간에 도달하여 스테이지를 옮기려 할 때마다 서버에게 요청을 합니다

- 서버는 요청받은 시간과 스테이지 시작 시간을 이용해 Stage time과 비교를 합니다

- 만약 성공했다면 서버에 유저의 현재 스테이지 정보를 저장합니다.

- 실패했다면 fail 응답을 보내어 클라이언트에서 게임을 중지 시킵니다.

![image](https://github.com/user-attachments/assets/affc82e5-7436-4a85-b028-268b4425a48f)

#### 게임 엔드 및 최고 점수

- 플레이어는 게임이 끝났을 경우(게임오버/클리어) 점수를 서버가 검증해주길 요청합니다.

- 서버는 받은 Score 값과 테이블의 scorePerSecond과 스테이지에 머문 시간을 통해 Score를 만들어 비교를 합니다.

- 이 때 비교에 성공한다면 서버에 존재하는 유저의 최고 점수를 확인합니다.

- 서버의 유저 최고 점수보다 유저의 최고점수가 높다면 이를 적용 하며 유저에게 재송신합니다.

- 서버에 기록된 최고 점수는 랭킹에 이용되며, 동일한 유저가 접속했다면 최고 점수를 계승하게 됩니다.

#### 아이템 획득

- DATA - Item

| Field | Type | Description|
|---|---|---|
| id | INT | 아이템의 고유 ID |
| score | INT | 획득 시 얻게되는 점수 |
| health | INT | 획득 시 회복되는 체력량 |
| damage | INT | 획득 시 증가하는 공격력 |
| attackSpeed | INT | 증가하는 초당 발사 속도 |
| speed | INT | 획득 시 증가하는 이동속도 |
| prob | INT | 몬스터를 죽였을 시 드랍되는 확률 |
| color | STRING | 아이템의 구분용 색 (헥사 색상 코드) |

- 유저가 아이템을 획득 할 때마다 이게 유효한 아이템인지 서버에 검증을 요청합니다.

- 유저가 획득한 아이템의 스탯과 서버에 저장된 데이터 속 아이템 스탯을 비교합니다.

- DATA - Unlock

| Field | Type | Description|
|---|---|---|
| id | INT | unlock 조건의 고유 ID |
| target_id | INT | 해금되는 아이템/몬스터의 ID |
| stage_level | INT | 해금되는 스테이지 레벨|

- 또한 아이템의 ID와 현재 Stage를 비교하여 이 아이템이 해금되어있는 Stage인지 검증합니다.

- 검증 결과 문제가 없다면 아이템의 점수를 유저 정보에 더해줍니다  
( 게임이 마무리되면 검증 Score에 사용됩니다. )

#### 채팅

![image](https://github.com/user-attachments/assets/a49f5a00-992f-4fac-8739-7d622748fa24)

- 인게임 오른쪽 하단에 오버레이로 버튼이 있으며 이를 누르면 채팅창이 열리게 됩니다.

- 채팅창은 자신의 닉네임을 이용해 참여할 수 있으며 서버에 연결된 전 유저가 확인할 수 있습니다.

#### 랭킹 시스템

![image](https://github.com/user-attachments/assets/94a0cade-305d-4a57-b505-556dd1886f2a)

- 서버에 저장된 최고 점수를 기준으로 최대 10명의 목록을 전 유저에게 실시간으로 제공하게 됩니다.

