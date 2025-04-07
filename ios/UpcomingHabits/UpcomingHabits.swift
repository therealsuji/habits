//
//  UpcomingHabits.swift
//  UpcomingHabits
//
//  Created by Sujitha Wijewantha on 2025-04-06.
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
  func getHabitFromUserDefaults() -> Habit {
    let defaults = UserDefaults(suiteName: "group.your.app.identifier")
    guard let habitData = defaults?.data(forKey: "nextHabit"),
          let habit = try? JSONDecoder().decode(Habit.self, from: habitData) else {
      return Habit(title: "Your All good for the day",time: nil,task: nil)
    }
    return habit
  }
  
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), habit: Habit(
      title: "Morning Routine",
      time: "in 20 Mins",
      task: "Morning meditation"
    ))
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let habit = getHabitFromUserDefaults()
    let entry = SimpleEntry(date: Date(), habit: habit)
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    // Get the current habit
    let habit = getHabitFromUserDefaults()
    let currentDate = Date()
    
    // Create an entry with the current habit
    let entry = SimpleEntry(date: currentDate, habit: habit)
    
    // Schedule next update in 15 minutes
    // This ensures we check for new habits frequently
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate) ?? currentDate
    
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    completion(timeline)
  }
  
  //    func relevances() async -> WidgetRelevances<Void> {
  //        // Generate a list containing the contexts this widget is relevant in.
  //    }
}

struct Habit: Codable {
  let title: String
  let time: String?
  let task: String?
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let habit: Habit
}

struct UpcomingHabitsEntryView : View {
  var entry: Provider.Entry
  
  var body: some View {
    let habit = entry.habit
    ZStack {
      RoundedRectangle(cornerRadius: 20)
        .fill(Color.black)
      
      VStack(alignment: .leading, spacing: 10) {
        Text(habit.title)
          .font(.system(size: 16, weight: .semibold))
          .foregroundColor(.white)
        if let task = habit.task {
          Text(task)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(.white)
        } else {
          Color.clear
            .frame(height: 20)
        }
        
        if let time = habit.time {
          Text(time)
            .font(.system(size: 12))
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
              Capsule()
                .fill(Color(hex: 0xFFFFFF,alpha: 0.25))
            )
        } else {
          Color.clear
            .frame(height: 20)
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding(15)
    }
  }
}

struct UpcomingHabits: Widget {
  let kind: String = "UpcomingHabits"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      if #available(iOS 17.0, *) {
        UpcomingHabitsEntryView(entry: entry)
          .containerBackground(.black, for: .widget)
      } else {
        UpcomingHabitsEntryView(entry: entry)
          .background()
      }
    }
    .configurationDisplayName("Habits")
    .description("A widget that shows your upcoming habits")
    .contentMarginsDisabled()
    .supportedFamilies([.systemSmall])
  }
}

extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: alpha
        )
    }
}


#Preview(as: .systemSmall) {
  UpcomingHabits()
} timeline: {
  SimpleEntry(date: .now, habit: Habit(
    title: "Lets start right now 🔥",
    time: "In 20 Mins",
    task: "Morning meditation"
  ))
}

