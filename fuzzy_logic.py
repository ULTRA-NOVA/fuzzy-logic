def get_freezing_mf(x, a, b, c, d):
    if x <= c:
        return 1
    if c <= x <= d:
        return -0.05*x+2.5
    if d <= x:
        return 0

def get_hot_mf(x, a, b, c, d):
    if x <= a:
        return 0
    if a <= x <= b:
        return 0.05*x-3.5
    if b <= x:
        return 1

def get_cool_mf(x, a, b, c):
    if x <= a or x >= c:
        return 0
    if x >= a and x <= b:
        return 0.05 * x - 1.5
    if x >= b and x <= c:
        return -0.05 * x + 3.5

def get_warm_mf(x, a, b, c):
    if x <= a or x >= c:
        return 0
    if x >= a and x <= b:
        return 0.05 * x - 2.5
    if x >= b and x <= c:
        return -0.05 * x + 4.5

def get_mf(x, mfs: list):
    F = get_freezing_mf(x, *mfs[0])
    if F != 0:
        print(f"It is {F*100:.2f}% freezing")
    F = get_cool_mf(x, *mfs[1])
    if F != 0:
        print(f"It is {F*100:.2f}% cool")
    F = get_warm_mf(x, *mfs[2])
    if F != 0:
        print(f"It is {F*100:.2f}% warm")
    F = get_hot_mf(x, *mfs[3])
    if F != 0:
        print(f"It is {F*100:.2f}% hot")

freezing_mf = [0, 0, 30, 50]
cold_mf = [30, 50, 70]
warm_mf = [50, 70, 90]
hot_mf = [70, 90, 110, 110]

while True:
    x = int(input("Enter temperature (in Fahrenheit): "))
    while x < 0 or x > 110:
        print("Invalid input. Please try again.")
        x = int(input("Enter temperature (in Fahrenheit): "))
    get_mf(x, [freezing_mf, cold_mf, warm_mf, hot_mf])

