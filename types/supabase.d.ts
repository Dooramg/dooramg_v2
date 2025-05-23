type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface SupabaseDataBase {
  public: {
    Tables: {
      block: {
        Row: {
          blockedUserId: string | null
          blockerUserId: string | null
          createdAt: string
          id: string
        }
        Insert: {
          blockedUserId?: string | null
          blockerUserId?: string | null
          createdAt?: string
          id?: string
        }
        Update: {
          blockedUserId?: string | null
          blockerUserId?: string | null
          createdAt?: string
          id?: string
        }
        Relationships: []
      }
      boardCommunity: {
        Row: {
          content: string | null
          createdAt: string | null
          id: string
          isPublished: boolean | null
          latitude: number | null
          locationAddress: string | null
          longitude: number | null
          title: string | null
          useLocation: boolean | null
          userId: string | null
        }
        Insert: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Update: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'boardCommunity_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      boardNotice: {
        Row: {
          content: string | null
          createdAt: string | null
          id: string
          isPublished: boolean | null
          latitude: number | null
          locationAddress: string | null
          longitude: number | null
          title: string | null
          useLocation: boolean | null
          userId: string | null
        }
        Insert: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Update: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'boardNotice_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      code: {
        Row: {
          code: string | null
          codeCategory: string | null
          codeName: string | null
          createdAt: string | null
          id: string
        }
        Insert: {
          code?: string | null
          codeCategory?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Update: {
          code?: string | null
          codeCategory?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Relationships: []
      }
      communityCommentList: {
        Row: {
          boardId: string | null
          comment: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
        }
        Insert: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityCommentList_boardId_fkey'
            columns: ['boardId']
            isOneToOne: false
            referencedRelation: 'boardCommunity'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'communityCommentList_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      communityCommentReport: {
        Row: {
          commentId: string | null
          createdAt: string
          id: string
          reportUserId: string | null
          resolved: boolean | null
        }
        Insert: {
          commentId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Update: {
          commentId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityCommentReport_commentId_fkey'
            columns: ['commentId']
            isOneToOne: false
            referencedRelation: 'communityCommentList'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'communityCommentReport_reportUserId_fkey'
            columns: ['reportUserId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      communityLikeCount: {
        Row: {
          boardId: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
        }
        Insert: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityLikeCount_boardId_fkey'
            columns: ['boardId']
            isOneToOne: false
            referencedRelation: 'boardCommunity'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'communityLikeCount_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      communityReport: {
        Row: {
          boardId: string | null
          createdAt: string
          id: string
          reportUserId: string | null
          resolved: boolean | null
        }
        Insert: {
          boardId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Update: {
          boardId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityReport_boardId_fkey'
            columns: ['boardId']
            isOneToOne: false
            referencedRelation: 'boardCommunity'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'communityReport_reportUserId_fkey'
            columns: ['reportUserId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      fuelData: {
        Row: {
          code: string | null
          codeName: string | null
          createdAt: string | null
          id: string
          opiCode: string | null
        }
        Insert: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
          opiCode?: string | null
        }
        Update: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
          opiCode?: string | null
        }
        Relationships: []
      }
      fuelStation: {
        Row: {
          code: string | null
          createdAt: string | null
          id: string
          logoImage: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
        }
        Relationships: []
      }
      manageType: {
        Row: {
          code: string | null
          codeName: string | null
          createdAt: string | null
          id: string
        }
        Insert: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Update: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Relationships: []
      }
      manufacturer: {
        Row: {
          createdAt: string | null
          id: string
          logoImage: string | null
          name: string | null
          orderBy: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
          orderBy?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
          orderBy?: string | null
        }
        Relationships: []
      }
      noticeCommentList: {
        Row: {
          boardId: string | null
          comment: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
        }
        Insert: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'noticeCommentList_boardId_fkey'
            columns: ['boardId']
            isOneToOne: false
            referencedRelation: 'boardNotice'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'noticeCommentList_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      noticeCommentReport: {
        Row: {
          commentId: string | null
          createdAt: string
          id: string
          reportUserId: string | null
          resolved: boolean | null
        }
        Insert: {
          commentId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Update: {
          commentId?: string | null
          createdAt?: string
          id?: string
          reportUserId?: string | null
          resolved?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'noticeCommentReport_commentId_fkey'
            columns: ['commentId']
            isOneToOne: false
            referencedRelation: 'noticeCommentList'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'noticeCommentReport_reportUserId_fkey'
            columns: ['reportUserId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      noticeLikeCount: {
        Row: {
          boardId: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
        }
        Insert: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'noticeLikeCount_boardId_fkey'
            columns: ['boardId']
            isOneToOne: false
            referencedRelation: 'boardNotice'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'noticeLikeCount_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      userInfo: {
        Row: {
          address: string | null
          addressDetail: string | null
          avatarImage: string | null
          avatarImageName: string | null
          createdAt: string | null
          email: string | null
          id: string
          isAdmin: boolean | null
          mainVehicleId: string | null
          mobile: string | null
          nickName: string | null
          signInAt: string | null
        }
        Insert: {
          address?: string | null
          addressDetail?: string | null
          avatarImage?: string | null
          avatarImageName?: string | null
          createdAt?: string | null
          email?: string | null
          id: string
          isAdmin?: boolean | null
          mainVehicleId?: string | null
          mobile?: string | null
          nickName?: string | null
          signInAt?: string | null
        }
        Update: {
          address?: string | null
          addressDetail?: string | null
          avatarImage?: string | null
          avatarImageName?: string | null
          createdAt?: string | null
          email?: string | null
          id?: string
          isAdmin?: boolean | null
          mainVehicleId?: string | null
          mobile?: string | null
          nickName?: string | null
          signInAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'userInfo_mainVehicleId_fkey'
            columns: ['mainVehicleId']
            isOneToOne: false
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      vehicleManagement: {
        Row: {
          createdAt: string | null
          destination: string | null
          driveDistance: number | null
          efficient: number | null
          fuelAmount: number | null
          fuelStationCode: string | null
          fuelStationName: string | null
          id: string
          manageTypeId: string | null
          memo: string | null
          paidAmount: number | null
          stationImage: string | null
          title: string | null
          totalDistance: number | null
          userId: string | null
          vehicleId: string | null
        }
        Insert: {
          createdAt?: string | null
          destination?: string | null
          driveDistance?: number | null
          efficient?: number | null
          fuelAmount?: number | null
          fuelStationCode?: string | null
          fuelStationName?: string | null
          id?: string
          manageTypeId?: string | null
          memo?: string | null
          paidAmount?: number | null
          stationImage?: string | null
          title?: string | null
          totalDistance?: number | null
          userId?: string | null
          vehicleId?: string | null
        }
        Update: {
          createdAt?: string | null
          destination?: string | null
          driveDistance?: number | null
          efficient?: number | null
          fuelAmount?: number | null
          fuelStationCode?: string | null
          fuelStationName?: string | null
          id?: string
          manageTypeId?: string | null
          memo?: string | null
          paidAmount?: number | null
          stationImage?: string | null
          title?: string | null
          totalDistance?: number | null
          userId?: string | null
          vehicleId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicleManagement_manageTypeId_fkey'
            columns: ['manageTypeId']
            isOneToOne: false
            referencedRelation: 'manageType'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicleManagement_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicleManagement_vehicleId_fkey'
            columns: ['vehicleId']
            isOneToOne: false
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      vehicleModel: {
        Row: {
          createdAt: string | null
          id: string
          manufacturerId: string | null
          name: string | null
          years: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string
          manufacturerId?: string | null
          name?: string | null
          years?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          manufacturerId?: string | null
          name?: string | null
          years?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicleModel_manufacturerId_fkey'
            columns: ['manufacturerId']
            isOneToOne: false
            referencedRelation: 'manufacturer'
            referencedColumns: ['id']
          },
        ]
      }
      vehicles: {
        Row: {
          bikeImage: string | null
          bikeImageName: string | null
          carNickName: string | null
          carNumber: string | null
          createdAt: string | null
          currentFuelAmount: number | null
          displacement: number | null
          fuelTypeId: string | null
          id: string
          insureceId: string | null
          makeYear: string | null
          manualModelName: string | null
          manufacturerId: string | null
          memo: string | null
          officialFuelEfficient: number | null
          plateHeadText: string | null
          plateMiddleText: string | null
          plateNumber: string | null
          plateTailText: string | null
          tankSize: number | null
          tireTypeId: string | null
          totalDistance: number | null
          totalEfficient: number | null
          totalFuelAmount: number | null
          totalPaidAmount: number | null
          userId: string | null
          vehicleModelId: string | null
        }
        Insert: {
          bikeImage?: string | null
          bikeImageName?: string | null
          carNickName?: string | null
          carNumber?: string | null
          createdAt?: string | null
          currentFuelAmount?: number | null
          displacement?: number | null
          fuelTypeId?: string | null
          id?: string
          insureceId?: string | null
          makeYear?: string | null
          manualModelName?: string | null
          manufacturerId?: string | null
          memo?: string | null
          officialFuelEfficient?: number | null
          plateHeadText?: string | null
          plateMiddleText?: string | null
          plateNumber?: string | null
          plateTailText?: string | null
          tankSize?: number | null
          tireTypeId?: string | null
          totalDistance?: number | null
          totalEfficient?: number | null
          totalFuelAmount?: number | null
          totalPaidAmount?: number | null
          userId?: string | null
          vehicleModelId?: string | null
        }
        Update: {
          bikeImage?: string | null
          bikeImageName?: string | null
          carNickName?: string | null
          carNumber?: string | null
          createdAt?: string | null
          currentFuelAmount?: number | null
          displacement?: number | null
          fuelTypeId?: string | null
          id?: string
          insureceId?: string | null
          makeYear?: string | null
          manualModelName?: string | null
          manufacturerId?: string | null
          memo?: string | null
          officialFuelEfficient?: number | null
          plateHeadText?: string | null
          plateMiddleText?: string | null
          plateNumber?: string | null
          plateTailText?: string | null
          tankSize?: number | null
          tireTypeId?: string | null
          totalDistance?: number | null
          totalEfficient?: number | null
          totalFuelAmount?: number | null
          totalPaidAmount?: number | null
          userId?: string | null
          vehicleModelId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicles_fuelTypeId_fkey'
            columns: ['fuelTypeId']
            isOneToOne: false
            referencedRelation: 'fuelData'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_manufacturerId_fkey'
            columns: ['manufacturerId']
            isOneToOne: false
            referencedRelation: 'manufacturer'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_vehicleModelId_fkey'
            columns: ['vehicleModelId']
            isOneToOne: false
            referencedRelation: 'vehicleModel'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
  Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
  PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
    PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
