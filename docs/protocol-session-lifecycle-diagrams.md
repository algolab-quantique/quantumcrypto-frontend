# Protocol Session Lifecycle Diagrams

> [!IMPORTANT]
> **Superseded.** The main architecture, adapter contract, and sequence
> diagrams are now in
> [shared-protocol-lifecycle-adr.md](shared-protocol-lifecycle-adr.md).
> This file is kept as historical context for the original preliminary thinking.

These diagrams describe the target architecture direction. They are not a claim
that the current code already implements every relationship exactly.

## Class Diagram

```mermaid
classDiagram
    class ProtocolSession {
        +Protocol protocol
        +GameMode mode
        +SessionStatus status
        +string gameCode
        +string room
        +string role
        +string playerName
        +string partner
        +ProtocolConfig config
        +ProtocolCheckpoint checkpoint
    }

    class ProtocolCheckpoint {
        +number step
        +string tab
        +LineList displayedLines
        +DateTime committedAt
        +GameState gameState
        +RoomState roomState
        +ProgressState progressState
    }

    class ProtocolLifecycleAdapter {
        +StorageKeyList storageKeys
        +getGameState()
        +restoreGameState()
        +getRoomState()
        +restoreRoomState()
        +resetRoomState()
        +getProgressState()
        +hydrateProgressState()
        +resetProgressState()
    }

    class SharedLifecycleService {
        +startFreshProtocolSession()
        +saveProtocolCheckpoint()
        +restoreProtocolCheckpoint()
        +completeProtocolSession()
        +abandonProtocolSession()
        +clearProtocolStorage()
    }

    class BB84Adapter
    class E91Adapter
    class DPSAdapter

    SharedLifecycleService --> ProtocolLifecycleAdapter
    SharedLifecycleService --> ProtocolSession
    ProtocolSession --> ProtocolCheckpoint
    ProtocolLifecycleAdapter <|-- BB84Adapter
    ProtocolLifecycleAdapter <|-- E91Adapter
    ProtocolLifecycleAdapter <|-- DPSAdapter
```

## Start Multiplayer Sequence

```mermaid
sequenceDiagram
    participant User
    participant Home as Protocol Home
    participant Lifecycle as Shared Lifecycle
    participant Store as Zustand Stores
    participant LS as localStorage
    participant Socket as WebSocket Provider
    participant Backend

    User->>Home: Choose multiplayer create/join
    Home->>Lifecycle: startFreshProtocolSession(protocol, "multiplayer")
    Lifecycle->>Store: reset protocol room/progress state
    Lifecycle->>LS: clear protocol keys
    Home->>Socket: connectToWaitingRoom()
    Socket->>Backend: join/create waiting room
    Backend-->>Socket: roles assigned
    Socket->>Store: set role, partner, config, evePresent
    Socket->>Store: set playingMultiplayer=true, playingSolo=false
    Socket->>LS: save playerData and initial checkpoint
    Socket->>Backend: connect play room
    Backend-->>Socket: connected
    Socket->>Home: navigate to play page
```

## Refresh / Reconnect Sequence

```mermaid
sequenceDiagram
    participant Browser
    participant Play as Play Page
    participant Lifecycle as Shared Lifecycle
    participant Store as Zustand Stores
    participant LS as localStorage
    participant Socket as WebSocket Provider
    participant Backend

    Browser->>Play: refresh / reload play page
    Play->>Lifecycle: restoreProtocolCheckpoint(protocol)
    Lifecycle->>LS: read player-storage and protocol keys
    Lifecycle->>Store: restore identity, config, room, progress

    alt completed game
        Lifecycle->>Play: restore completed felicitation screen
    else active multiplayer
        Lifecycle->>Socket: reconnect play room
        Socket->>Backend: reconnect with gameCode, room, role
        alt backend snapshot available
            Backend-->>Socket: room snapshot or event history
            Socket->>Store: apply backend-authoritative shared facts
            Store-->>Play: show player-paced checkpoint/catch-up UI
        else backend snapshot unavailable
            Lifecycle-->>Play: use local checkpoint fallback
        end
    end
```

## Completed Game Sequence

```mermaid
sequenceDiagram
    participant Player
    participant Play as Play Page
    participant Store as Zustand Stores
    participant LS as localStorage
    participant Results as Results Page

    Play->>Store: set gameSuccess=true
    Store->>LS: persist completed checkpoint
    Play-->>Player: show felicitation screen

    alt Player clicks View Results
        Player->>Results: navigate to results route
        Results-->>Player: display backend results
    else Player clicks Home
        Player->>Play: home action
        Play->>LS: clear protocol keys
        Play->>Store: reset active mode flags
    else Player clicks Replay
        Player->>Play: replay action
        Play->>LS: clear protocol keys
        Play->>Store: start fresh empty session
    end
```
